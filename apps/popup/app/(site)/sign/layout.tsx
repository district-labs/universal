'use client';
import type { ReactNode } from 'react';

import { Address } from '@/components/onchain/address';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountState } from '@/lib/state/use-account-state';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const { accountState } = useAccountState();

  function openSettings() {
    router.push('/settings');
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header
        className={cn(
          'top-0 z-50 w-full border-b-2 bg-background py-4 text-center text-foreground transition-all',
        )}
      >
        {accountState ? (
          <div className='flex w-full items-center justify-between px-4'>
            <span className='font-semibold text-sm'>Account</span>
            <div className="flex items-center gap-x-2">
              <Address
                className="font-bold"
                truncate={true}
                address={accountState.smartContractAddress}
              />
              <div
                className='cursor-pointer p-1 hover:bg-neutral-100'
                onClick={openSettings}
              >
                <Settings className='mx-auto size-4' />
              </div>
            </div>
          </div>
        ) : (
          <Skeleton className='h-5 w-20' />
        )}
      </header>
      <main className='relative z-10 flex h-full flex-1 flex-col justify-center'>
        {children}
      </main>
    </div>
  );
}
