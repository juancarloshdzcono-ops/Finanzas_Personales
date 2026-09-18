export type ViewKey = 'resumen' | 'conceptos' | 'tarjeta' | 'nu';

const TABS: { key: ViewKey; label: string; path: string }[] = [
  { key: 'resumen', label: 'Resumen', path: 'M3 12l2-2 4 4 8-8 4 4' },
  { key: 'conceptos', label: 'Conceptos', path: 'M4 6h16M4 12h16M4 18h10' },
  { key: 'tarjeta', label: 'Tarjeta', path: '' },
  { key: 'nu', label: 'Nu', path: 'M12 2v20M6 8c0-3 3-4 6-4s6 1 6 4-3 4-6 4-6 1-6 4 3 4 6 4 6-1 6-4' },
];

export function TabBar({ active, onChange }: { active: ViewKey; onChange: (v: ViewKey) => void }) {
  return (
    <nav className="flex flex-shrink-0 border-t border-border bg-app-bg px-1.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            aria-current={isActive}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-0.5 py-1.5 text-[11px] font-semibold transition-all ${isActive ? 'font-extrabold text-ink' : 'text-ink-dim'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={isActive ? 'var(--accent)' : 'currentColor'} strokeWidth="2" className={`h-[22px] w-[22px] transition-transform ${isActive ? '-translate-y-px' : ''}`}>
              {tab.key === 'tarjeta' ? (
                <>
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M3 10h18" />
                </>
              ) : (
                <path d={tab.path} />
              )}
            </svg>
            {tab.label}
            <span className={`-mt-0.5 h-[5px] w-[5px] rounded-full bg-accent ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          </button>
        );
      })}
    </nav>
  );
}
