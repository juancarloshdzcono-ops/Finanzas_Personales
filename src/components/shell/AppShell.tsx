import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { TopBar } from './TopBar';
import { TabBar, type ViewKey } from './TabBar';
import { UpdateToast } from './UpdateToast';
import { ResumenView } from '../views/ResumenView';
import { ConceptosView } from '../views/ConceptosView';
import { TarjetaView } from '../views/TarjetaView';
import { NuView } from '../views/NuView';
import type { AuthState } from '../../hooks/useAuth';

export function AppShell({ auth }: { auth: AuthState }) {
  const [view, setView] = useState<ViewKey>('resumen');
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <div className="flex min-h-[680px] w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] border border-border bg-app-bg shadow-[var(--card-shadow)] max-[440px]:min-h-screen max-[440px]:rounded-none max-[440px]:border-none">
      <TopBar />
      {needRefresh && <UpdateToast onClick={() => updateServiceWorker(true)} />}
      <div className="flex-1 overflow-y-auto px-[18px] pb-5 pt-3">
        {view === 'resumen' && <ResumenView auth={auth} />}
        {view === 'conceptos' && <ConceptosView />}
        {view === 'tarjeta' && <TarjetaView />}
        {view === 'nu' && <NuView />}
      </div>
      <TabBar active={view} onChange={setView} />
    </div>
  );
}
