'use client';

import type { ReactNode } from 'react';
import { useWcInitialization } from './wallet-kit/hooks/use-wc-initialization';
import { useWcEventsManager } from './wallet-kit/hooks/use-wc-events-manager';

export default function WcLayout({ children }: { children: ReactNode }) {
  const initialized = useWcInitialization();
  useWcEventsManager(initialized);

  // TODO: Handle ui/toast for when WC is not initialized
  return <>{children}</>;
}
