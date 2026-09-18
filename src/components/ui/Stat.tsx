export function Stat({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'warn' }) {
  const toneClass = tone === 'good' ? 'text-good' : tone === 'warn' ? 'text-warn' : 'text-ink';
  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-dim">{label}</div>
      <div className={`num mt-1 text-xl font-extrabold ${toneClass}`}>{value}</div>
    </div>
  );
}
