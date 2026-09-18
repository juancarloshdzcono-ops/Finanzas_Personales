export type MedioPago = 'efectivo' | 'tdc';
export type ConceptStatus = 'disponible' | 'en_nu' | 'pagado';

export interface Concept {
  id: string;
  nombre: string;
  q1: number;
  q2: number;
  medio: MedioPago;
  reserva: boolean;
  status?: ConceptStatus;
}

export interface Ingresos {
  q1: number;
  q2: number;
}

export interface Period {
  ingresos: Ingresos;
  tenemos: number;
  ppngi: number | null;
  concepts: Concept[];
}

export type Periods = Record<string, Period>;

export interface AppState {
  periods: Periods;
  currentPeriod: string;
}
