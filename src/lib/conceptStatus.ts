import type { Concept, ConceptStatus } from '../types';

export function getStatus(c: Concept): ConceptStatus {
  if (c.status) return c.status;
  return c.reserva ? 'en_nu' : 'disponible';
}

export function getStatusLabel(s: ConceptStatus): string {
  if (s === 'en_nu') return '🟡 En Nu';
  if (s === 'pagado') return '🟢 Pagado';
  return '⚪ Retirar';
}

export function nextStatus(s: ConceptStatus): ConceptStatus {
  if (s === 'disponible') return 'en_nu';
  if (s === 'en_nu') return 'pagado';
  return 'disponible';
}
