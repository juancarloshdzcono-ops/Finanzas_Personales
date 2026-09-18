import type { ReactNode } from 'react';
import type { Concept, ConceptStatus } from '../../types';
import { getStatus } from '../../lib/conceptStatus';
import { Card } from '../ui/Card';
import { FieldLabel, NumberField, TextField } from '../ui/Field';
import { useFinanzas } from '../../state/FinanzasContext';

const STATUS_OPTIONS: { key: ConceptStatus; label: string; activeClass: string }[] = [
  { key: 'disponible', label: '⚪ Retirar', activeClass: 'bg-surface border-border text-ink' },
  { key: 'en_nu', label: '🟡 En Nu', activeClass: 'bg-status-nu-bg border-status-nu-border text-status-nu-text' },
  { key: 'pagado', label: '🟢 Pagado', activeClass: 'bg-status-pagado-bg border-status-pagado-border text-status-pagado-text' },
];

export function ConceptCard({ concept }: { concept: Concept }) {
  const { updateConcept, deleteConcept, setConceptStatus } = useFinanzas();
  const status = getStatus(concept);

  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <TextField
          value={concept.nombre}
          onChange={(e) => updateConcept(concept.id, { nombre: e.target.value })}
          className="font-bold"
        />
        <button
          onClick={() => deleteConcept(concept.id)}
          title="Borrar"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] border border-border bg-surface-2 text-base text-warn active:scale-90"
        >
          ✕
        </button>
      </div>

      <div>
        <FieldLabel>Estado del dinero</FieldLabel>
        <div className="flex gap-1.5 rounded-xl bg-surface-2 p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setConceptStatus(concept.id, opt.key)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[11.5px] font-bold transition-all ${
                status === opt.key ? opt.activeClass : 'border-transparent text-ink-dim'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <FieldLabel>1ra quincena</FieldLabel>
          <NumberField value={concept.q1} onChange={(e) => updateConcept(concept.id, { q1: Number(e.target.value) || 0 })} />
        </div>
        <div>
          <FieldLabel>2da quincena</FieldLabel>
          <NumberField value={concept.q2} onChange={(e) => updateConcept(concept.id, { q2: Number(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FlagButton active={concept.medio === 'efectivo'} onClick={() => updateConcept(concept.id, { medio: 'efectivo' })}>Efectivo</FlagButton>
        <FlagButton active={concept.medio === 'tdc'} onClick={() => updateConcept(concept.id, { medio: 'tdc' })}>TDC</FlagButton>
        <FlagButton active={concept.reserva} onClick={() => updateConcept(concept.id, { reserva: !concept.reserva })}>Reserva 1ra Q</FlagButton>
      </div>
    </Card>
  );
}

function FlagButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all ${
        active ? 'border-transparent bg-gloss text-white' : 'border-border bg-surface-2 text-ink-dim'
      }`}
    >
      {children}
    </button>
  );
}
