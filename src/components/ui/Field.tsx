import type { InputHTMLAttributes, ReactNode } from 'react';

const baseInputClass = 'w-full rounded-[10px] border border-border bg-surface-2 px-2.5 py-2 font-sans text-sm text-ink transition-colors focus:border-accent focus:outline-none';

export function NumberField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input type="number" className={`num text-right ${baseInputClass} ${className}`} {...rest} />;
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input type="text" className={`${baseInputClass} ${className}`} {...rest} />;
}

export function EmailField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input type="email" className={`${baseInputClass} ${className}`} {...rest} />;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold text-ink-dim">{children}</label>;
}
