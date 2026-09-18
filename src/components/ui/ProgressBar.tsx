export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="my-3 h-[9px] overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-good transition-[width] duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}
