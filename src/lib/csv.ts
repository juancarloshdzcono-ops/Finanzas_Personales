import type { Periods } from '../types';
import { uid } from './format';

function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] !== undefined ? cols[idx].trim() : ''; });
    rows.push(row);
  }
  return rows;
}

export interface ImportResult {
  touched: Periods;
  errors: string[];
}

export function importCSVText(text: string, existingPeriods: Periods): ImportResult {
  const rows = parseCSV(text);
  const touched: Periods = {};
  const errors: string[] = [];

  rows.forEach((r, i) => {
    const mes = (r.mes || '').trim();
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      errors.push(`Fila ${i + 2}: mes inválido ("${r.mes || ''}")`);
      return;
    }
    if (!touched[mes]) {
      const existing = existingPeriods[mes];
      touched[mes] = {
        ingresos: { q1: 0, q2: 0 },
        tenemos: existing ? existing.tenemos : 0,
        ppngi: existing ? existing.ppngi : null,
        concepts: [],
      };
    }
    const tipo = (r.tipo || '').trim().toLowerCase();
    if (tipo === 'ingreso') {
      touched[mes].ingresos.q1 = Number(r.q1) || 0;
      touched[mes].ingresos.q2 = Number(r.q2) || 0;
    } else if (tipo === 'gasto') {
      touched[mes].concepts.push({
        id: uid(),
        nombre: r.concepto || 'Concepto',
        q1: Number(r.q1) || 0,
        q2: Number(r.q2) || 0,
        medio: (r.medio || '').trim().toLowerCase() === 'tdc' ? 'tdc' : 'efectivo',
        reserva: /^(si|sí|true|1)$/i.test((r.reserva || '').trim()),
      });
    } else {
      errors.push(`Fila ${i + 2}: tipo inválido ("${r.tipo || ''}"), debe ser "ingreso" o "gasto"`);
    }
  });

  return { touched, errors };
}

export const TEMPLATE_CSV = 'mes,tipo,concepto,q1,q2,medio,reserva\n'
  + '2026-01,ingreso,,16000,15500,,\n'
  + '2026-01,gasto,Renta,2500,2500,efectivo,si\n'
  + '2026-01,gasto,Netflix,200,200,tdc,si\n';
