export function fmt(n: number | null | undefined): string {
  const value = Number(n) || 0;
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
}

export function uid(): string {
  return 'c' + Math.random().toString(36).slice(2, 9);
}
