import { useAuth } from './hooks/useAuth';
import { AuthGate } from './components/auth/AuthGate';
import { FinanzasProvider } from './state/FinanzasContext';
import { AppShell } from './components/shell/AppShell';

export default function App() {
  const auth = useAuth();

  if (auth.status === 'loading') return null;
  if (auth.status === 'gate') return <AuthGate auth={auth} />;

  return (
    <FinanzasProvider>
      <AppShell auth={auth} />
    </FinanzasProvider>
  );
}
