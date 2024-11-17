import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { walletKitClient } from '@/lib/walletconnect/client';
import { useActiveSessions } from '@/lib/walletconnect/hooks/use-active-connections';
import { getSdkError } from '@walletconnect/utils';
import { Addreth } from 'addreth';
import { Circle, LogOut, Unplug } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { PWAInstallPrompt } from '../core/pwa-install-prompt';
import { DisconnectWalletElement } from '../onchain/disconnect-wallet-element';
import { Button } from '../ui/button';
type AccountPopover = React.HTMLAttributes<HTMLElement>;

export const AccountPopover = ({ className }: AccountPopover) => {
  const { address } = useAccount();
  const activeSessionsQuery = useActiveSessions();

  const sessions = useMemo(() => {
    if (!activeSessionsQuery.data) {
      return;
    }
    return Object.values(activeSessionsQuery.data);
  }, [activeSessionsQuery.data]);

  console.log(activeSessionsQuery.data, 'activeSessionsQuery');
  console.log(sessions, 'sessions');

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button variant={'emerald'}>
            <Circle className="size-5" />
            {/* <Address truncate={true} truncateLength={4} address={address} /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'mx-[10px] mt-2 min-w-[calc(100vw-20px)] p-0 md:mr-4 md:min-w-[520px]',
            className,
          )}
        >
          <div className="flex items-center justify-between border-b-2 p-4">
            <div className="flex items-center">
              {address && (
                <Addreth
                  theme={'simple-light'}
                  address={address}
                  explorer={(address) => ({
                    name: 'Base Sepolia',
                    accountUrl: `https://sepolia.basescan.org/address/${address}`,
                  })}
                />
              )}
            </div>
            <DisconnectWalletElement
              asChild={true}
              className="flex items-center gap-x-1 text-sm"
            >
              <Button className="text-neutral-500" variant={'ghost'} size="sm">
                Disconnect <LogOut className="size-3" />{' '}
              </Button>
            </DisconnectWalletElement>
          </div>
          <div className="p-4">
            {activeSessionsQuery.isLoading ||
              (sessions && sessions.length === 0 && (
                <div className="py-4 text-center font-medium text-neutral-500">
                  No active application connections
                </div>
              ))}
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
                          onClick={async () => {
                            await walletKitClient?.disconnectSession({
                              topic: session.topic,
                              reason: getSdkError('USER_DISCONNECTED'),
                            });
                            await activeSessionsQuery.refetch();
                          }}
                        >
                          <Unplug className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className="border-t-2">
            <PWAInstallPrompt>
              <div className="bg-neutral-100/60 px-4 py-3">
                <div className="curs flex w-full items-center justify-between">
                  <span className="font-semibold text-neutral-600">
                    Install Universal
                  </span>
                  <Image
                    className="rounded-md shadow-md"
                    src="/icon-192x192.png"
                    width={18}
                    height={18}
                    alt="Universal Wallet"
                  />
                </div>
              </div>
            </PWAInstallPrompt>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
