'use client';
import WalletConnect from '@/assets/brands/walletconnect.svg';
import { CameraQrScanner } from '@/components/camera/camera-qr-scanner';
import { QRCodeGeneratedDialog } from '@/components/core/qr-code-generated-dialog';
import { AccountMenu } from '@/components/layout/account-menu';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Badge } from '@/components/ui/badge';
import { LinkComponent } from '@/components/ui/link-component';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsUniversalConnected } from '@/lib/hooks/use-is-universal-connected';
import { cn } from '@/lib/utils';
import { useWcAccountsSync } from '@/lib/walletconnect/hooks/use-wc-accounts-sync';
import { useWcEventsManager } from '@/lib/walletconnect/hooks/use-wc-events-manager';
import { Circle } from 'lucide-react';
import type { ReactNode } from 'react';
import { SvgIcon } from 'universal-wallet-ui';

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
                      <Popover>
                        <PopoverTrigger>
                          <Badge
                            variant={'outline'}
                            className="transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-center gap-x-1">
                              <span className="text-2xs">Supports</span>
                              <SvgIcon src={WalletConnect} className="size-4" />
                              <span className="hidden text-2xs md:inline">
                                Connect
                              </span>
                            </div>
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="content">
                          <h3 className="mb-2 font-bold text-lg">
                            WalletConnect Support
                          </h3>
                          <p className="text-xs">
                            Connect to apps using WalletConnect:
                          </p>
                          <ol className="list-inside list-decimal pl-2 text-xs">
                            <li>Scan QR Code</li>
                            <li>Paste WC Link</li>
                          </ol>
                          <p className="text-xs">
                            <LinkComponent href="https://walletconnect.network/">
                              {' '}
                              WalletConnect
                            </LinkComponent>{' '}
                            is supported by many applications, making it easy to
                            connect to your favorite apps.
                          </p>
                        </PopoverContent>
                      </Popover>

                      <CameraQrScanner
                        isWalletConnectEnabled={isUniversalConnected}
                      />
                      <QRCodeGeneratedDialog />
                    </div>
                    <AccountMenu className="order-1 flex-1 md:order-2 md:flex-none" />
                  </div>
                </IsWalletConnected>
                <IsWalletDisconnected>
                  <div className="flex w-full items-center justify-between md:justify-end">
                    <Circle className="ml-0 size-6 text-emerald-600 md:hidden" />
                    <div className="flex items-center gap-x-2">
                      <ConnectUniversalWalletButton
                        variant={'emerald'}
                        className="font-bold"
                      >
                        Connect
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
