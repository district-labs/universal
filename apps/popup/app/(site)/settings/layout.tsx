'use client';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useAccountState } from '@/lib/state/use-account-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Address } from '@/components/onchain/address';
import { ArrowLeft } from 'lucide-react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const { accountState } = useAccountState();

  function previousPage() {
    router.back();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all text-center py-4',
        )}
      >
        {accountState ? (
          <div className="w-full flex justify-between items-center px-4">
            <span className="p-1 hover:bg-neutral-100 cursor-pointer rounded-lg">
              <ArrowLeft className="size-5 mx-auto" onClick={previousPage} />
            </span>
            <div className="flex items-center gap-x-2">
              <Address
                className="font-bold"
                truncate={true}
                address={accountState.smartContractAddress}
              />
            </div>
          </div>
        ) : (
          <Skeleton className="w-20 h-5" />
        )}
      </header>
      <main className="flex flex-1 flex-col justify-center z-10 relative h-full">
        {children}
      </main>
    </div>
  );
}
