'use client';

import type { ReactNode } from 'react';
import { useWcInitialization } from './wallet-kit/hooks/use-wc-initialization';
import { useWcEventsManager } from './wallet-kit/hooks/use-wc-events-manager';
import { Skeleton } from '@/components/ui/skeleton';

export default function WcLayout({ children }: { children: ReactNode }) {
  const initialized = useWcInitialization();
  useWcEventsManager(initialized);

  if (!initialized)
    return (
      <div className="w-full container max-w-3xl py-20">
        <Skeleton className="w-full h-96" />
      </div>
    );
  // TODO: Handle ui/toast for when WC is not initialized
  return <>{children}</>;
}
