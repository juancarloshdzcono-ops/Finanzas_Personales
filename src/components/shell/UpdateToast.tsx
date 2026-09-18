export function UpdateToast({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="mx-4 mb-1 mt-2.5 flex cursor-pointer items-center justify-between rounded-xl bg-gloss px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(130,10,209,0.35)]"
    >
      <span>✨ Nueva versión lista</span>
      <span className="underline">Toca para actualizar</span>
    </div>
  );
}
