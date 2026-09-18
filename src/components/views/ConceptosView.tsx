import { useRef, type ChangeEvent } from 'react';
import { useFinanzas } from '../../state/FinanzasContext';
import { ConceptCard } from './ConceptCard';
import { AddButton } from '../ui/Buttons';
import { TEMPLATE_CSV } from '../../lib/csv';

export function ConceptosView() {
  const { period, addConcept, importCSV, exportJSON, importJSON } = useFinanzas();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { importedKeys, errors } = importCSV(String(reader.result));
      if (!importedKeys.length) {
        alert('No se importó nada.' + (errors.length ? '\n\n' + errors.join('\n') : ' Revisa el formato del CSV.'));
        return;
      }
      let msg = `Importados ${importedKeys.length} mes(es): ${importedKeys.sort().join(', ')}.`;
      if (errors.length) msg += '\n\nAvisos:\n' + errors.join('\n');
      alert(msg);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CSV)}`;

  return (
    <div>
      <h2 className="section-title">Tus conceptos <span className="normal-case tracking-normal">— agrega, edita o borra</span></h2>
      <div className="flex flex-col gap-2.5">
        {period.concepts.map((c) => <ConceptCard key={c.id} concept={c} />)}
      </div>
      <AddButton onClick={addConcept}>+ Agregar concepto</AddButton>
      <p className="mt-3.5 text-xs leading-relaxed text-ink-dim">
        Marca <b>TDC</b> si el gasto se carga a la tarjeta (alimenta la pestaña Tarjeta) y <b>Reserva 1ra Q</b> si ese dinero ya está comprometido en cuanto cae la primera quincena (alimenta la pestaña Nu).
      </p>

      <h2 className="section-title mt-[22px]">Copia de respaldo y sincronización rápida</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            const data = exportJSON();
            navigator.clipboard.writeText(data).then(
              () => alert('¡Copia de respaldo copiada al portapapeles! Puedes pegarla en tu celular o guardarla.'),
              () => {
                prompt('Copia este texto para respaldar tus conceptos:', data);
              },
            );
          }}
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-bold text-ink transition-all active:scale-[0.98]"
        >
          📋 Copiar respaldo de datos al portapapeles
        </button>
        <button
          onClick={() => {
            const text = prompt('Pega aquí el texto de respaldo JSON:');
            if (!text) return;
            const ok = importJSON(text);
            if (ok) {
              alert('¡Conceptos y periodos restaurados correctamente!');
            } else {
              alert('El texto no tiene un formato válido de respaldo.');
            }
          }}
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-bold text-ink-dim transition-all active:scale-[0.98]"
        >
          📥 Restaurar respaldo desde texto
        </button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-dim">
        Úsalo para transferir tus conceptos de tu computadora al celular al instante en Modo Local sin necesidad de iniciar sesión.
      </p>

      <h2 className="section-title mt-[22px]">Importar meses desde CSV</h2>
      <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={handleFile} />
      <AddButton onClick={() => fileRef.current?.click()}>Importar CSV de meses anteriores</AddButton>
      <p className="mt-2 text-xs leading-relaxed text-ink-dim">
        Columnas: <code>mes,tipo,concepto,q1,q2,medio,reserva</code> — <code>mes</code> como <code>2026-01</code>, <code>tipo</code> es <code>ingreso</code> o <code>gasto</code>. Reemplaza por completo los conceptos de cualquier mes que aparezca en el archivo.{' '}
        <a href={templateHref} download="plantilla-mis-quincenas.csv" className="text-ink-dim underline">Descargar plantilla</a>.
      </p>
    </div>
  );
}
