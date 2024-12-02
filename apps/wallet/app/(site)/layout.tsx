'use client';

import { CameraQrScanner } from '@/components/camera/camera-qr-scanner';
import { QRCodeGeneratedDialog } from '@/components/core/qr-code-generated-dialog';
import { AccountPopover } from '@/components/layout/account-popover';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { ConnectButton } from '@/components/onchain/connect-button';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsUniversalConnected } from '@/lib/hooks/use-is-universal-connected';
import { cn } from '@/lib/utils';
import { useWcAccountsSync } from '@/lib/walletconnect/hooks/use-wc-accounts-sync';
import { useWcEventsManager } from '@/lib/walletconnect/hooks/use-wc-events-manager';
import { Circle, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const isUniversalConnected = useIsUniversalConnected();
  useWcEventsManager(isUniversalConnected);
  useWcAccountsSync();

  return (
    <div className="relative flex max-w-[100vw] flex-col">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col pb-20 md:pb-0">
          <header
            className={cn(
              'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all md:relative',
            )}
          >
            <div className="flex w-full items-center justify-between px-4 py-4">
              <div className="order-2 flex flex-1 items-center gap-x-1 md:order-1">
                <SidebarTrigger className="hidden md:flex" />
              </div>
              <div className="order-1 flex w-full items-end justify-end md:order-2 md:flex-1">
                <IsWalletConnected>
                  <div className="flex w-full items-center gap-x-5">
                    <div className="order-2 flex flex-1 items-center justify-end gap-x-2">
                      <QRCodeGeneratedDialog />
                      <CameraQrScanner
                        isWalletConnectEnabled={isUniversalConnected}
                      />
                    </div>
                    <AccountPopover className="order-1 flex-1 md:order-2 md:flex-none" />
                  </div>
                </IsWalletConnected>
                <IsWalletDisconnected>
                  <div className="flex w-full items-center justify-between md:justify-end">
                    <Circle className="ml-0 size-6 text-emerald-600 md:hidden" />
                    <div className="flex items-center gap-x-2">
                      <ConnectButton variant={'outline'} rounded={'full'}>
                        <Wallet className="size-4" />
                      </ConnectButton>
                      <ConnectUniversalWalletButton variant={'emerald'}>
                        Connect
                        <Circle className="ml-0 hidden size-2 md:inline-block" />
                      </ConnectUniversalWalletButton>
                    </div>
                  </div>
                </IsWalletDisconnected>
              </div>
            </div>
          </header>
          <main className="relative z-10 flex flex-1 flex-col">{children}</main>
          <MobileMenu />
        </div>
      </SidebarProvider>
    </div>
  );
}
