import { useFinanzas } from '../../state/FinanzasContext';
import { monthLabel } from '../../lib/period';

export function PeriodSwitch() {
  const { currentPeriod, periodKeys, goPrevPeriod, goNextPeriod, isNextPeriodNew } = useFinanzas();
  const idx = periodKeys.indexOf(currentPeriod);

  return (
    <div className="mt-2.5 flex items-center gap-2">
      <button
        onClick={goPrevPeriod}
        disabled={idx <= 0}
        aria-label="Mes anterior"
        className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[10px] border border-border bg-surface-2 font-bold text-ink transition-transform active:scale-95 disabled:opacity-35"
      >
        ‹
      </button>
      <span className="flex-1 text-center text-[13.5px] font-bold text-ink">{monthLabel(currentPeriod)}</span>
      <button
        onClick={goNextPeriod}
        aria-label={isNextPeriodNew ? 'Crear mes siguiente' : 'Mes siguiente'}
        className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[10px] border border-border bg-surface-2 font-bold text-ink transition-transform active:scale-95"
      >
        {isNextPeriodNew ? '+' : '›'}
      </button>
    </div>
  );
}
