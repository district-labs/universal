import { useIsUniversalConnected } from '@/lib/hooks/use-is-universal-connected';
import { useActiveSessions } from '@/lib/walletconnect/hooks/use-active-connections';
import { useWalletKitClient } from '@/lib/walletconnect/hooks/use-wallet-kit-client';
import { useDisconnectWc } from '@/lib/walletconnect/hooks/use-wc-disconnect';
import { Download, LogOut, ScanQrCode, Unplug } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { PWAInstallPrompt } from '../core/pwa-install-prompt';
import { DisconnectWalletElement } from '../onchain/disconnect-wallet-element';
import { WalletPFP } from '../onchain/wallet-pfp';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { CopyIconButton } from '../core/copy-icon-button';
import { AccountAddress } from '../onchain/account-address';
import { AccountExplorerLink } from '../onchain/account-explorer-link';

type AccountMenu = React.HTMLAttributes<HTMLElement>;

export const AccountMenu = ({ className }: AccountMenu) => {
  const isUniversalConnected = useIsUniversalConnected();
  const { address } = useAccount();
  const { isBelowMd } = useBreakpoint('md');
  const { disconnectWc } = useDisconnectWc();
  const { data: walletKitClient } = useWalletKitClient();
  const activeSessionsQuery = useActiveSessions({
    enabled: isUniversalConnected,
  });

  const sessions = useMemo(() => {
    if (!activeSessionsQuery.data) {
      return;
    }
    return Object.values(activeSessionsQuery.data);
  }, [activeSessionsQuery.data]);

  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild={true}>
          <span className="relative cursor-pointer">
            <WalletPFP
              address={address}
              className="size-10 rounded-full border-[2px] border-white shadow-md transition-all hover:scale-105 hover:shadow-xl"
            />
          </span>
        </SheetTrigger>
        <SheetContent
          isCloseDisabled={true}
          side={isBelowMd ? 'bottom' : 'right'}
          className="top-16 bottom-0 h-auto w-full rounded-t-2xl p-0 md:top-0 md:max-w-screen-sm md:rounded-t-none"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Account Overview</SheetTitle>
            <SheetDescription>
              Manage your connected wallets and accounts.
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between border-b-2 p-4">
                <div className="flex items-center gap-x-2">
                  {address && (
                    <>
                      <WalletPFP
                        address={address}
                        className="size-6 rounded-full shadow-sm"
                      />
                      <AccountAddress
                        isLink={true}
                        truncate={true}
                        truncateLength={5}
                        address={address}
                        className="font-medium text-sm"
                      />
                      <div className="ml-2 flex items-center gap-x-2">
                        <CopyIconButton value={address} />
                        <span className="">
                          <AccountExplorerLink
                            className="-top-0.5 relative block"
                            address={address}
                          />
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <DisconnectWalletElement
                  asChild={true}
                  className="flex items-center gap-x-1 text-sm"
                >
                  <Button
                    className="text-neutral-500"
                    variant={'ghost'}
                    size="sm"
                  >
                    Disconnect <LogOut className="size-3" />{' '}
                  </Button>
                </DisconnectWalletElement>
              </div>
              {isUniversalConnected && (
                <div className="border-b-2 p-4">
                  {/* If no wallet connect client is set, show a skeleton */}
                  {!walletKitClient && <Skeleton className="h-20 w-full" />}
                  {sessions && sessions.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-y-1 py-4 text-center font-medium text-neutral-500">
                      <span className="font-bold">
                        No Active WalletConnect Sessions
                      </span>
                      <span className="flex items-center gap-x-1 text-right text-sm">
                        Click the scan{' '}
                        <span className="flex items-center text-blue-500">
                          <ScanQrCode className="size-5 text-lg" />
                        </span>{' '}
                        icon to connect with other applications.
                      </span>
                    </div>
                  )}
                  {activeSessionsQuery.isSuccess &&
                    sessions &&
                    sessions.length > 0 && (
                      <div className="flex flex-col gap-y-2">
                        <span className="text-left font-semibold text-sm">
                          Active Connections
                        </span>
                        {sessions.map((session) => (
                          <div
                            className="rounded-sm p-1 hover:bg-neutral-50"
                            key={session?.topic}
                          >
                            <div className="flex items-center justify-between gap-x-2">
                              <div className="flex items-center gap-x-2">
                                <Image
                                  alt="logo"
                                  className="size-5 rounded-lg"
                                  src={
                                    session.peer.metadata.icons[0] ??
                                    '/images/logo-xl.png'
                                  }
                                  width={24}
                                  height={24}
                                />
                                <div className="font-bold">
                                  {session.peer.metadata.name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!disconnectWc}
                                onClick={() =>
                                  disconnectWc?.({ topic: session.topic })
                                }
                              >
                                <Unplug className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="border-t-2">
              <PWAInstallPrompt>
                <div className="bg-neutral-100/60 p-3 transition-all hover:bg-neutral-100/90 hover:shadow-inner md:p-5">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-x-2 text-neutral-500 md:text-md">
                        <Download className="size-3.5 text-neutral-500 md:size-4" />
                        <span className="font-semibold text-sm md:text-lg">
                          Install Universal Now
                        </span>
                        <span className="text-xs">| </span>
                        <span className="itatlic text-xs">
                          Progressive Web App{' '}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-x-2">
                        <Image
                          height={20}
                          width={20}
                          src="/images/platforms/android.png"
                          alt="Anrdoid Smartphone"
                          className="size-4"
                        />
                        <Image
                          height={20}
                          width={20}
                          src="/images/platforms/ios.webp"
                          alt="iOS Smartphone"
                          className="size-4"
                        />
                        <Image
                          className="size-5 rounded-md"
                          src="/icon-192x192.png"
                          width={20}
                          height={20}
                          alt="Universal Wallet"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </PWAInstallPrompt>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
