import { PeriodSwitch } from './PeriodSwitch';
import { useTheme } from '../../hooks/useTheme';

export function TopBar() {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex-shrink-0 border-b border-white/5 bg-app-bg px-5 pb-3.5 pt-[max(18px,calc(env(safe-area-inset-top,0px)+12px))]">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-gloss text-[10.5px] font-extrabold uppercase tracking-[0.12em]">Kizuna Fintech</span>
        <button
          onClick={toggle}
          className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-ink-dim active:scale-95 transition-transform"
        >
          {theme === 'light' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </div>
      <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-ink">Mis Quincenas</h1>
      <PeriodSwitch />
    </div>
  );
}
