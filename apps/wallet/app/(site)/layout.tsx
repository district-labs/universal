'use client';
import { CameraQrScanner } from '@/components/camera/camera-qr-scanner';
import { PWAEnvironment } from '@/components/core/pwa-environment';
import { QRCodeGeneratedDialog } from '@/components/core/qr-code-generated-dialog';
import { SiteEnvironment } from '@/components/core/site-environment';
import { AccountPopover } from '@/components/layout/account-popover';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { ConnectButton } from '@/components/onchain/connect-button';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useWcEventsManager } from '@/lib/walletconnect/hooks/use-wc-events-manager';
import { useWcInitialization } from '@/lib/walletconnect/hooks/use-wc-initialization';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const initialized = useWcInitialization();
  useWcEventsManager(initialized);

  return (
    <>
      <div className="relative flex max-w-[100vw] flex-col">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col pb-20 md:pb-0">
            <header
              className={cn(
                'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all lg:relative',
              )}
            >
              <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="flex flex-1 items-center gap-x-1">
                  <SidebarTrigger className="size-9" />
                </div>
                <div>
                  <IsWalletConnected>
                    <div className="flex items-center gap-x-2">
                      <CameraQrScanner isWalletConnectEnabled={true} />
                      <QRCodeGeneratedDialog />
                      <AccountPopover />
                      <ConnectButton enableChainView={true} />
                    </div>
                  </IsWalletConnected>
                  <IsWalletDisconnected>
                    <SiteEnvironment>
                      <ConnectButton
                        rounded={'full'}
                        classNameConnect="font-semibold"
                      >
                        Connect Wallet
                      </ConnectButton>
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
            <MobileMenu />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
