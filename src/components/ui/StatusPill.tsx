import type { ConceptStatus } from '../../types';
import { getStatusLabel } from '../../lib/conceptStatus';

const TONE_CLASS: Record<ConceptStatus, string> = {
  en_nu: 'bg-status-nu-bg border-status-nu-border text-status-nu-text',
  pagado: 'bg-status-pagado-bg border-status-pagado-border text-status-pagado-text',
  disponible: 'bg-status-libre-bg border-status-libre-border text-status-libre-text',
};

export function StatusPill({
  status,
  onClick,
  compact = false,
}: {
  status: ConceptStatus;
  onClick?: () => void;
  compact?: boolean;
}) {
  const Comp = onClick ? 'button' : 'span';
  return (
    <Comp
      onClick={onClick}
      title={onClick ? 'Toca para cambiar estado' : undefined}
      className={[
        'inline-flex select-none items-center gap-1 whitespace-nowrap rounded-full border font-bold transition-transform active:scale-90',
        compact ? 'px-1.5 py-0.5 text-[9.5px]' : 'px-2.5 py-1 text-[11px]',
        TONE_CLASS[status],
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {getStatusLabel(status)}
    </Comp>
  );
}
