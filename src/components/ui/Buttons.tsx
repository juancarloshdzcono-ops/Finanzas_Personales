import type { ButtonHTMLAttributes } from 'react';

export function AddButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      {...rest}
      className={`mt-3 w-full rounded-2xl border-[1.5px] border-dashed border-border bg-transparent p-3.5 font-bold text-ink-dim transition-all hover:border-accent hover:text-accent active:scale-[0.98] ${className}`}
    />
  );
}

export function SolidButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      {...rest}
      className={`mt-2.5 w-full rounded-2xl border-none bg-gloss p-3.5 font-bold text-white shadow-[0_8px_20px_-6px_rgba(130,10,209,0.5)] transition-all active:scale-[0.98] active:brightness-95 disabled:cursor-default disabled:opacity-60 ${className}`}
    />
  );
}
