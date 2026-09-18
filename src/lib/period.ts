import type { Period, Periods } from '../types';
import { uid } from './format';

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function adjacentKey(key: string, delta: number): string {
  const [yStr, mStr] = key.split('-');
  let y = parseInt(yStr, 10);
  let m = parseInt(mStr, 10) + delta;
  while (m > 12) { m -= 12; y += 1; }
  while (m < 1) { m += 12; y -= 1; }
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return `${MESES[parseInt(m, 10) - 1]} ${y}`;
}

export function defaultPeriod(): Period {
  return {
    ingresos: { q1: 16500, q2: 16000 },
    tenemos: 2800,
    ppngi: null,
    concepts: [
      { id: uid(), nombre: 'Renta', q1: 2500, q2: 2500, medio: 'efectivo', reserva: true, status: 'en_nu' },
      { id: uid(), nombre: 'Internet', q1: 400, q2: 400, medio: 'tdc', reserva: true, status: 'pagado' },
      { id: uid(), nombre: 'Netflix', q1: 200, q2: 200, medio: 'tdc', reserva: true, status: 'disponible' },
      { id: uid(), nombre: 'Gasolina', q1: 1500, q2: 1500, medio: 'tdc', reserva: false, status: 'disponible' },
      { id: uid(), nombre: 'Ahorro', q1: 3000, q2: 3000, medio: 'efectivo', reserva: true, status: 'en_nu' },
    ],
  };
}

export function periodKeys(periods: Periods): string[] {
  return Object.keys(periods).sort();
}

export function nextRecurringPeriod(prev: Period): Period {
  return {
    ingresos: { q1: prev.ingresos.q1, q2: prev.ingresos.q2 },
    tenemos: 0,
    ppngi: null,
    concepts: prev.concepts.map((c) => ({
      id: uid(), nombre: c.nombre, q1: c.q1, q2: c.q2, medio: c.medio, reserva: c.reserva,
    })),
  };
}
