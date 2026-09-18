import { useState } from 'react';
import type { AuthState } from '../../hooks/useAuth';
import { Card } from '../ui/Card';
import { EmailField, FieldLabel } from '../ui/Field';
import { SolidButton, AddButton } from '../ui/Buttons';

export function AuthGate({ auth }: { auth: AuthState }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(
    auth.error ? `El link falló: ${auth.error}` : 'Sin contraseña — te mandamos un link para entrar.',
  );

  async function handleSend() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setSending(true);
    setMessage('Enviando...');
    const errorMessage = await auth.sendMagicLink(trimmed);
    setSending(false);
    setMessage(errorMessage ? `Error: ${errorMessage}` : 'Revisa tu correo y toca el link para entrar.');
  }

  return (
    <div className="flex min-h-[680px] w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] border border-border bg-app-bg shadow-[var(--card-shadow)] max-[440px]:min-h-screen max-[440px]:rounded-none max-[440px]:border-none">
      <div className="border-b border-white/5 bg-app-bg px-5 pb-3.5 pt-[18px]">
        <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-ink">Mis Quincenas</h1>
      </div>
      <div className="flex flex-1 flex-col justify-center px-[18px] pb-5 pt-3">
        <Card>
          <FieldLabel>Tu correo</FieldLabel>
          <EmailField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="mb-2.5"
          />
          <SolidButton onClick={handleSend} disabled={sending}>Enviarme el link</SolidButton>
          <p className="mt-2.5 text-xs leading-relaxed text-ink-dim">{message}</p>

          <div className="relative my-4 text-center">
            <hr className="border-t border-border" />
            <span className="relative -top-[9px] bg-surface px-2 text-[11px] font-semibold text-ink-dim">O entra directo</span>
          </div>
          <AddButton onClick={auth.useBypass} className="mt-0 border-solid p-2.5 text-[13px]">
            📱 Usar en este celular (Modo Local)
          </AddButton>
        </Card>
      </div>
    </div>
  );
}
