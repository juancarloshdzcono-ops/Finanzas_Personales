import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { AppState, Concept, ConceptStatus, Period, Periods } from '../types';
import { adjacentKey, currentMonthKey, defaultPeriod, nextRecurringPeriod, periodKeys } from '../lib/period';
import { uid } from '../lib/format';
import { importCSVText } from '../lib/csv';
import { loadFromSupabase, loadLocalCache, saveLocal, syncPeriod } from './persistence';

type Action =
  | { type: 'LOAD'; periods: Periods; currentPeriod: string }
  | { type: 'SET_PERIOD'; key: string }
  | { type: 'UPDATE_INGRESO'; quincena: 'q1' | 'q2'; value: number }
  | { type: 'UPDATE_TENEMOS'; value: number }
  | { type: 'UPDATE_PPNGI'; value: number }
  | { type: 'ADD_CONCEPT' }
  | { type: 'UPDATE_CONCEPT'; id: string; patch: Partial<Concept> }
  | { type: 'DELETE_CONCEPT'; id: string }
  | { type: 'SET_CONCEPT_STATUS'; id: string; status: ConceptStatus }
  | { type: 'PREV_PERIOD' }
  | { type: 'NEXT_PERIOD' }
  | { type: 'IMPORT_CSV'; touched: Periods };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return { periods: action.periods, currentPeriod: action.currentPeriod };
    case 'SET_PERIOD':
      return { ...state, currentPeriod: action.key };
    case 'UPDATE_INGRESO': {
      const p = state.periods[state.currentPeriod];
      const period: Period = { ...p, ingresos: { ...p.ingresos, [action.quincena]: action.value } };
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: period } };
    }
    case 'UPDATE_TENEMOS': {
      const p = state.periods[state.currentPeriod];
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, tenemos: action.value } } };
    }
    case 'UPDATE_PPNGI': {
      const p = state.periods[state.currentPeriod];
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, ppngi: action.value } } };
    }
    case 'ADD_CONCEPT': {
      const p = state.periods[state.currentPeriod];
      const concept: Concept = { id: uid(), nombre: 'Nuevo concepto', q1: 0, q2: 0, medio: 'efectivo', reserva: false };
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, concepts: [...p.concepts, concept] } } };
    }
    case 'UPDATE_CONCEPT': {
      const p = state.periods[state.currentPeriod];
      const concepts = p.concepts.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c));
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, concepts } } };
    }
    case 'DELETE_CONCEPT': {
      const p = state.periods[state.currentPeriod];
      const concepts = p.concepts.filter((c) => c.id !== action.id);
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, concepts } } };
    }
    case 'SET_CONCEPT_STATUS': {
      const p = state.periods[state.currentPeriod];
      const concepts = p.concepts.map((c) => (
        c.id === action.id
          ? { ...c, status: action.status, reserva: action.status === 'en_nu' ? true : c.reserva }
          : c
      ));
      return { ...state, periods: { ...state.periods, [state.currentPeriod]: { ...p, concepts } } };
    }
    case 'PREV_PERIOD': {
      const keys = periodKeys(state.periods);
      const idx = keys.indexOf(state.currentPeriod);
      if (idx <= 0) return state;
      return { ...state, currentPeriod: keys[idx - 1] };
    }
    case 'NEXT_PERIOD': {
      const keys = periodKeys(state.periods);
      const idx = keys.indexOf(state.currentPeriod);
      if (idx < keys.length - 1) {
        return { ...state, currentPeriod: keys[idx + 1] };
      }
      const latest = keys[keys.length - 1];
      const newKey = adjacentKey(latest, 1);
      const created = nextRecurringPeriod(state.periods[latest]);
      return { periods: { ...state.periods, [newKey]: created }, currentPeriod: newKey };
    }
    case 'IMPORT_CSV': {
      const periods = { ...state.periods, ...action.touched };
      const keys = periodKeys(periods);
      return { periods, currentPeriod: keys[keys.length - 1] };
    }
    default:
      return state;
  }
}

interface FinanzasContextValue {
  period: Period;
  currentPeriod: string;
  periodKeys: string[];
  updateIngreso: (q: 'q1' | 'q2', value: number) => void;
  updateTenemos: (value: number) => void;
  updatePpngi: (value: number) => void;
  addConcept: () => void;
  updateConcept: (id: string, patch: Partial<Concept>) => void;
  deleteConcept: (id: string) => void;
  setConceptStatus: (id: string, status: ConceptStatus) => void;
  goPrevPeriod: () => void;
  goNextPeriod: () => void;
  isNextPeriodNew: boolean;
  importCSV: (text: string) => { importedKeys: string[]; errors: string[] };
}

const FinanzasContext = createContext<FinanzasContextValue | null>(null);

export function FinanzasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { periods: {}, currentPeriod: '' });
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      let periods: Periods;
      let isFreshAccount = false;
      try {
        periods = await loadFromSupabase();
        if (!Object.keys(periods).length) {
          const cached = loadLocalCache();
          isFreshAccount = true;
          periods = cached && Object.keys(cached).length ? cached : { [currentMonthKey()]: defaultPeriod() };
        }
      } catch {
        const cached = loadLocalCache();
        periods = cached && Object.keys(cached).length ? cached : { [currentMonthKey()]: defaultPeriod() };
      }
      if (cancelled) return;
      const keys = periodKeys(periods);
      const initialState: AppState = { periods, currentPeriod: keys[keys.length - 1] };
      dispatch({ type: 'LOAD', periods: initialState.periods, currentPeriod: initialState.currentPeriod });
      saveLocal(initialState);
      loadedRef.current = true;
      setReady(true);
      if (isFreshAccount) {
        keys.forEach((k) => { syncPeriod(initialState, k).catch(() => {}); });
      }
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveLocal(state);
    const t = setTimeout(() => { syncPeriod(state, state.currentPeriod).catch(() => {}); }, 400);
    return () => clearTimeout(t);
  }, [state]);

  const value = useMemo<FinanzasContextValue | null>(() => {
    if (!ready) return null;
    const keys = periodKeys(state.periods);
    return {
      period: state.periods[state.currentPeriod],
      currentPeriod: state.currentPeriod,
      periodKeys: keys,
      updateIngreso: (q, value) => dispatch({ type: 'UPDATE_INGRESO', quincena: q, value }),
      updateTenemos: (value) => dispatch({ type: 'UPDATE_TENEMOS', value }),
      updatePpngi: (value) => dispatch({ type: 'UPDATE_PPNGI', value }),
      addConcept: () => dispatch({ type: 'ADD_CONCEPT' }),
      updateConcept: (id, patch) => dispatch({ type: 'UPDATE_CONCEPT', id, patch }),
      deleteConcept: (id) => dispatch({ type: 'DELETE_CONCEPT', id }),
      setConceptStatus: (id, status) => dispatch({ type: 'SET_CONCEPT_STATUS', id, status }),
      goPrevPeriod: () => dispatch({ type: 'PREV_PERIOD' }),
      goNextPeriod: () => dispatch({ type: 'NEXT_PERIOD' }),
      isNextPeriodNew: keys.indexOf(state.currentPeriod) === keys.length - 1,
      importCSV: (text: string) => {
        const { touched, errors } = importCSVText(text, state.periods);
        const importedKeys = Object.keys(touched);
        if (importedKeys.length) dispatch({ type: 'IMPORT_CSV', touched });
        return { importedKeys, errors };
      },
    };
  }, [state, ready]);

  if (!value) return null;

  return <FinanzasContext.Provider value={value}>{children}</FinanzasContext.Provider>;
}

export function useFinanzas(): FinanzasContextValue {
  const ctx = useContext(FinanzasContext);
  if (!ctx) throw new Error('useFinanzas debe usarse dentro de FinanzasProvider');
  return ctx;
}
