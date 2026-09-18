import { useEffect } from 'react';
import { useFinanzas } from '../../state/FinanzasContext';
import { fmt } from '../../lib/format';
import { Card } from '../ui/Card';
import { FieldLabel, NumberField } from '../ui/Field';
import { ProgressBar } from '../ui/ProgressBar';

export function TarjetaView() {
  const { period, updatePpngi, updateTenemos } = useFinanzas();
  const tdcConcepts = period.concepts.filter((c) => c.medio === 'tdc');
  const sugerido = tdcConcepts.reduce((sum, c) => sum + c.q1 + c.q2, 0);
  const ppngi = period.ppngi ?? sugerido;
  const tenemos = Number(period.tenemos) || 0;
  const falta = Math.max(0, ppngi - tenemos);
  const pct = ppngi > 0 ? Math.min(100, Math.round((100 * tenemos) / ppngi)) : 0;

  // Igual que el prototipo original: la primera vez que un periodo no trae PPNGI capturado,
  // se inicializa (y se persiste) con la suma sugerida de conceptos TDC; después queda editable.
  useEffect(() => {
    if (period.ppngi === null) updatePpngi(sugerido);
  }, [period.ppngi, sugerido, updatePpngi]);

  return (
    <div>
      <h2 className="section-title">Cargos que reconoce de tus conceptos</h2>
      <Card className="!p-2.5">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr>
              <th className="pb-2 text-left text-[10.5px] font-bold uppercase tracking-wide text-ink-dim">Cargo a la tarjeta</th>
              <th className="pb-2 text-right text-[10.5px] font-bold uppercase tracking-wide text-ink-dim">Mensual</th>
            </tr>
          </thead>
          <tbody>
            {tdcConcepts.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="py-2.5 text-left">{c.nombre}</td>
                <td className="num py-2.5 text-right">{fmt(c.q1 + c.q2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border">
              <td className="pt-2.5 text-left text-[13.5px] font-extrabold">Suma de conceptos TDC</td>
              <td className="num pt-2.5 text-right text-[13.5px] font-extrabold">{fmt(sugerido)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          Esto es solo lo que capturaste en Conceptos — tu estado de cuenta real puede incluir más cosas.
        </p>
      </Card>

      <h2 className="section-title">Pago para no generar intereses (PPNGI)</h2>
      <Card>
        <FieldLabel>Monto real de tu estado de cuenta</FieldLabel>
        <NumberField value={ppngi} onChange={(e) => updatePpngi(Number(e.target.value) || 0)} />
      </Card>

      <h2 className="section-title">Tu avance</h2>
      <Card>
        <FieldLabel>Ya llevas apartado</FieldLabel>
        <NumberField value={tenemos} onChange={(e) => updateTenemos(Number(e.target.value) || 0)} className="mb-1" />
        <ProgressBar percent={pct} />
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[13.5px] text-ink-dim">Falta</span>
          <span className="num text-[15px] font-bold text-ink">{fmt(falta)}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2.5">
          <span className="text-[13.5px] text-ink-dim">Por quincena (2)</span>
          <span className="num text-[15px] font-bold text-ink">{fmt(falta / 2)}</span>
        </div>
      </Card>
    </div>
  );
}
