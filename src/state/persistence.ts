import { supabase } from '../lib/supabase';
import { currentMonthKey } from '../lib/period';
import type { AppState, ConceptStatus, MedioPago, Periods } from '../types';

const STORAGE_KEY = 'mis-quincenas-v1';

interface ConceptRow {
  id: string;
  nombre: string;
  q1: number;
  q2: number;
  medio: MedioPago;
  reserva: boolean;
  status?: ConceptStatus;
  sort_order?: number;
}

interface PeriodRow {
  period_key: string;
  ingresos_q1: number;
  ingresos_q2: number;
  tenemos: number;
  ppngi: number | null;
  concepts?: ConceptRow[];
}

export function saveLocal(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage puede fallar en modo privado o con cuota llena; el estado sigue en memoria.
  }
}

export function loadLocalCache(): Periods | null {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (raw && raw.periods) return raw.periods as Periods;
    if (raw && raw.concepts) {
      return {
        [currentMonthKey()]: {
          ingresos: raw.ingresos || { q1: 0, q2: 0 },
          tenemos: raw.tenemos || 0,
          ppngi: raw.ppngi ?? null,
          concepts: raw.concepts || [],
        },
      };
    }
  } catch {
    // cache corrupta o inaccesible: se ignora y se sigue con datos remotos/por defecto.
  }
  return null;
}

export async function loadFromSupabase(): Promise<Periods> {
  const res = await supabase.from('periods').select('*, concepts(*)').order('period_key');
  if (res.error) throw res.error;
  const periods: Periods = {};
  ((res.data as PeriodRow[] | null) || []).forEach((row) => {
    const cs = (row.concepts || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    periods[row.period_key] = {
      ingresos: { q1: Number(row.ingresos_q1) || 0, q2: Number(row.ingresos_q2) || 0 },
      tenemos: Number(row.tenemos) || 0,
      ppngi: row.ppngi === null || row.ppngi === undefined ? null : Number(row.ppngi),
      concepts: cs.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        q1: Number(c.q1) || 0,
        q2: Number(c.q2) || 0,
        medio: c.medio,
        reserva: !!c.reserva,
        status: c.status || (c.reserva ? 'en_nu' : 'disponible'),
      })),
    };
  });
  return periods;
}

export async function syncPeriod(state: AppState, key: string): Promise<void> {
  const p = state.periods[key];
  if (!p) return;
  try {
    const up = await supabase
      .from('periods')
      .upsert(
        { period_key: key, ingresos_q1: p.ingresos.q1, ingresos_q2: p.ingresos.q2, tenemos: p.tenemos, ppngi: p.ppngi },
        { onConflict: 'owner_id,period_key' },
      )
      .select()
      .single();
    if (up.error || !up.data) return;
    const periodId = up.data.id;
    await supabase.from('concepts').delete().eq('period_id', periodId);
    if (p.concepts.length) {
      const rows = p.concepts.map((c, i) => ({
        period_id: periodId, nombre: c.nombre, q1: c.q1, q2: c.q2, medio: c.medio, reserva: c.reserva, sort_order: i,
        ...(c.status ? { status: c.status } : {}),
      }));
      const ins = await supabase.from('concepts').insert(rows);
      if (ins.error?.message?.includes('status')) {
        await supabase.from('concepts').insert(
          p.concepts.map((c, i) => ({ period_id: periodId, nombre: c.nombre, q1: c.q1, q2: c.q2, medio: c.medio, reserva: c.reserva, sort_order: i })),
        );
      }
    }
  } catch {
    // sin conexión: el cambio ya quedó en localStorage y se reintenta en el próximo guardado.
  }
}
