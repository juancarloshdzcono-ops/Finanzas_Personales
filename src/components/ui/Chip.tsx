import type { ReactNode } from 'react';

export function Chip({ tone, children }: { tone: 'tdc' | 'efectivo' | 'reserva'; children: ReactNode }) {
  const cls = tone === 'tdc'
    ? 'bg-tdc-soft text-tdc'
    : tone === 'reserva'
      ? 'bg-status-nu-bg text-status-nu-text'
      : 'bg-surface-2 text-ink-dim';
  return <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${cls}`}>{children}</span>;
}
