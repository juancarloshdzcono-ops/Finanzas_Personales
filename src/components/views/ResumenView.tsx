import { useFinanzas } from '../../state/FinanzasContext';
import { getStatus, nextStatus } from '../../lib/conceptStatus';
import { fmt } from '../../lib/format';
import { Card } from '../ui/Card';
import { Stat } from '../ui/Stat';
import { StatusPill } from '../ui/StatusPill';
import { Chip } from '../ui/Chip';
import { NumberField } from '../ui/Field';
import type { AuthState } from '../../hooks/useAuth';

export function ResumenView({ auth }: { auth: AuthState }) {
  const { period, updateIngreso, setConceptStatus } = useFinanzas();

  let tq1 = 0, tq2 = 0, sumNu = 0, sumPagado = 0, sumLibre = 0;
  period.concepts.forEach((c) => {
    const total = c.q1 + c.q2;
    tq1 += c.q1; tq2 += c.q2;
    const st = getStatus(c);
    if (st === 'en_nu') sumNu += total;
    else if (st === 'pagado') sumPagado += total;
    else sumLibre += total;
  });

  const sq1 = (Number(period.ingresos.q1) || 0) - tq1;
  const sq2 = (Number(period.ingresos.q2) || 0) - tq2;

  return (
    <div>
      <h2 className="section-title">Control de estatus</h2>
      <div className="mb-3.5 grid grid-cols-3 gap-2">
        <StatusSummaryCard tone="nu" label="En Nu" value={fmt(sumNu)} />
        <StatusSummaryCard tone="pagado" label="Pagado" value={fmt(sumPagado)} />
        <StatusSummaryCard tone="libre" label="Por retirar" value={fmt(sumLibre)} />
      </div>

      <h2 className="section-title">Ingresos de la quincena</h2>
      <Card>
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[13.5px] text-ink-dim">1ra quincena</span>
          <NumberField
            value={period.ingresos.q1}
            onChange={(e) => updateIngreso('q1', Number(e.target.value) || 0)}
            className="max-w-[130px]"
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2.5">
          <span className="text-[13.5px] text-ink-dim">2da quincena</span>
          <NumberField
            value={period.ingresos.q2}
            onChange={(e) => updateIngreso('q2', Number(e.target.value) || 0)}
            className="max-w-[130px]"
          />
        </div>
      </Card>

      <h2 className="section-title">
        Gastos por concepto <span className="normal-case tracking-normal text-ink-dim">(toca el botón para cambiar estado)</span>
      </h2>
      <Card className="!p-3">
        <div className="divide-y divide-border/60">
          {period.concepts.map((c) => {
            const st = getStatus(c);
            return (
              <div key={c.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-[14px] font-bold text-ink truncate">{c.nombre}</span>
                    <Chip tone={c.medio === 'tdc' ? 'tdc' : 'efectivo'}>{c.medio === 'tdc' ? 'TDC' : 'Efectivo'}</Chip>
                    {c.reserva && <Chip tone="reserva">Reserva</Chip>}
                  </div>
                  <div className="flex-shrink-0">
                    <StatusPill status={st} onClick={() => setConceptStatus(c.id, nextStatus(st))} />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-2/60 px-2.5 py-1.5 text-xs text-ink-dim">
                  <div className="flex items-center gap-3">
                    <span>1ra Q: <strong className="num font-semibold text-ink">{fmt(c.q1)}</strong></span>
                    <span className="text-border">|</span>
                    <span>2da Q: <strong className="num font-semibold text-ink">{fmt(c.q2)}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="mr-1 text-[11px] text-ink-dim">Total:</span>
                    <span className="num font-extrabold text-ink text-[13.5px]">{fmt(c.q1 + c.q2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de totales claramente desglosado */}
        <div className="mt-3 pt-3 border-t-2 border-border flex flex-col gap-1.5 bg-surface-2/30 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[12.5px] text-ink-dim">
            <span>Total 1ra quincena:</span>
            <span className="num font-bold text-ink">{fmt(tq1)}</span>
          </div>
          <div className="flex items-center justify-between text-[12.5px] text-ink-dim">
            <span>Total 2da quincena:</span>
            <span className="num font-bold text-ink">{fmt(tq2)}</span>
          </div>
          <div className="flex items-center justify-between text-[14px] font-extrabold text-ink pt-1.5 border-t border-border/60">
            <span>Total gastos mensual:</span>
            <span className="num text-accent-ink font-black text-[16px]">{fmt(tq1 + tq2)}</span>
          </div>
        </div>
      </Card>

      <h2 className="section-title">Lo que sobra</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="1ra quincena" value={fmt(sq1)} tone={sq1 < 0 ? 'warn' : 'good'} />
        <Stat label="2da quincena" value={fmt(sq2)} tone={sq2 < 0 ? 'warn' : 'good'} />
      </div>

      <div className="mt-4 flex flex-col gap-1.5 text-xs text-ink-dim">
        <div className="flex items-center justify-between gap-2">
          <span>{auth.email}</span>
          <button onClick={auth.signOut} className="font-semibold text-warn">Cerrar sesión</button>
        </div>
        {auth.status === 'bypass' && (
          <p className="text-[11px] text-ink-dim/70 text-center">
            Modo Local activo. Los datos se guardan en este dispositivo.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusSummaryCard({ tone, label, value }: { tone: 'nu' | 'pagado' | 'libre'; label: string; value: string }) {
  const toneClass = {
    nu: 'bg-status-nu-bg border-status-nu-border text-status-nu-text',
    pagado: 'bg-status-pagado-bg border-status-pagado-border text-status-pagado-text',
    libre: 'bg-status-libre-bg border-status-libre-border text-status-libre-text',
  }[tone];
  const dot = { nu: '🟡', pagado: '🟢', libre: '⚪' }[tone];
  return (
    <div className={`flex flex-col rounded-2xl border px-2.5 pb-2 pt-2.5 transition-transform active:scale-[0.97] ${toneClass}`}>
      <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide">
        <span className="text-[9px]">{dot}</span>
        <span>{label}</span>
      </div>
      <div className="num mt-1 text-[14.5px] font-extrabold">{value}</div>
    </div>
  );
}
