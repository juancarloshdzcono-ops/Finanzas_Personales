import { useFinanzas } from '../../state/FinanzasContext';
import { getStatus } from '../../lib/conceptStatus';
import { fmt } from '../../lib/format';
import { Card } from '../ui/Card';
import { Stat } from '../ui/Stat';
import { StatusPill } from '../ui/StatusPill';

export function NuView() {
  const { period } = useFinanzas();
  const nuConcepts = period.concepts.filter((c) => c.reserva || c.status === 'en_nu');
  const total = nuConcepts.reduce((sum, c) => sum + (Number(c.q1) || 0), 0);

  return (
    <div>
      <h2 className="section-title">¿Cuánto muevo a Nu?</h2>
      <p className="text-xs leading-relaxed text-ink-dim">
        Estos conceptos (marcados <b>Reserva 1ra Q</b> en Conceptos) ya te llegaron con tu 1ra quincena, pero se pagan hasta fin de mes — mientras tanto, ese dinero puede estar rindiendo en Nu en vez de quieto en tu cuenta de siempre:
      </p>
      <Card className="mt-2.5 !p-2.5">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr>
              <th className="pb-2 text-left text-[10.5px] font-bold uppercase tracking-wide text-ink-dim">Concepto</th>
              <th className="pb-2 text-right text-[10.5px] font-bold uppercase tracking-wide text-ink-dim">1ra Q</th>
            </tr>
          </thead>
          <tbody>
            {nuConcepts.map((c) => {
              const st = getStatus(c);
              return (
                <tr key={c.id} className="border-t border-border">
                  <td className="py-2.5 text-left">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.nombre}
                      <StatusPill status={st} compact />
                    </div>
                  </td>
                  <td className="num py-2.5 text-right">{fmt(c.q1)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border">
              <td className="pt-2.5 text-left text-[13.5px] font-extrabold">Puedes mover a Nu</td>
              <td className="num pt-2.5 text-right text-[13.5px] font-extrabold">{fmt(total)}</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      <h2 className="section-title">De un vistazo</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Ingreso 1ra Q" value={fmt(period.ingresos.q1)} />
        <Stat label="Puedes mover a Nu" value={fmt(total)} tone="good" />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-dim">
        Esta cifra sale directo de sumar lo marcado como "Reserva 1ra Q" en Conceptos — no se resta de tu ingreso, porque ese dinero de todas formas ya lo tenías apartado para pagarse a fin de mes.
      </p>
    </div>
  );
}
