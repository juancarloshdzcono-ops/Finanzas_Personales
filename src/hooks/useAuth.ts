import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const BYPASS_KEY = 'local_bypass';

export type AuthStatus = 'loading' | 'authed' | 'bypass' | 'gate';

export interface AuthState {
  status: AuthStatus;
  email: string | null;
  error: string | null;
  sendMagicLink: (email: string) => Promise<string | null>;
  useBypass: () => void;
  signOut: () => Promise<void>;
}

function urlErrorDescription(): string | null {
  const q = new URLSearchParams(window.location.search);
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const desc = q.get('error_description') || h.get('error_description') || q.get('error') || h.get('error');
  return desc ? decodeURIComponent(desc.replace(/\+/g, ' ')) : null;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [bypass, setBypass] = useState(() => {
    try { return localStorage.getItem(BYPASS_KEY) === 'true'; } catch { return false; }
  });
  const [error] = useState<string | null>(() => urlErrorDescription());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const status: AuthStatus = session === undefined
    ? 'loading'
    : session
      ? 'authed'
      : bypass
        ? 'bypass'
        : 'gate';

  return {
    status,
    email: session?.user.email ?? (bypass ? '📱 Celular (Modo Local)' : null),
    error,
    sendMagicLink: async (email: string) => {
      const redirectTo = window.location.origin + window.location.pathname;
      const res = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      return res.error ? res.error.message : null;
    },
    useBypass: () => {
      try { localStorage.setItem(BYPASS_KEY, 'true'); } catch { /* localStorage no disponible */ }
      setBypass(true);
    },
    signOut: async () => {
      try { localStorage.removeItem(BYPASS_KEY); } catch { /* no-op */ }
      setBypass(false);
      await supabase.auth.signOut();
    },
  };
}
