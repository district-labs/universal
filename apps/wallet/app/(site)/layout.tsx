import { AppSidebar } from '@/components/app-sidebar';
import { ConnectUniversalWalletButton } from '@/components/connect-universal-wallet';
import { ConnectButton } from '@/components/onchain/connect-button';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { PWAEnvironment } from '@/components/pwa-environment';
import { SiteEnvironment } from '@/components/site-environment';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <header
              className={cn(
                'sticky lg:relative top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all',
              )}
            >
              <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="flex-1">
                  <SidebarTrigger className="size-9" />
                </div>
                <div className="">
                  <IsWalletConnected>
                    <ConnectButton rounded={'full'} />
                  </IsWalletConnected>
                  <IsWalletDisconnected>
                    <SiteEnvironment>
                      <ConnectButton rounded={'full'} />
                    </SiteEnvironment>
                    <PWAEnvironment>
                      <ConnectUniversalWalletButton>
                        Connect
                      </ConnectUniversalWalletButton>
                    </PWAEnvironment>
                  </IsWalletDisconnected>
                </div>
              </div>
            </header>
            <main className="relative z-10 flex flex-1 flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
