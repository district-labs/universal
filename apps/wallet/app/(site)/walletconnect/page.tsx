'use client';

import { Button } from '@/components/ui/button';
import { walletKitClient } from './wallet-kit/client';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useActiveSessions } from './wallet-kit/hooks/use-active-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { getSdkError } from '@walletconnect/utils';

import { WcScanner } from './wallet-kit/components/wc-scanner';
import { useConnectWc } from './wallet-kit/hooks/use-connect-wc';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WalletConnectPage() {
  const [uri, setUri] = useState<string | undefined>();
  const activeSessionsQuery = useActiveSessions();
  const connectWcMutation = useConnectWc();

  const sessions = useMemo(() => {
    if (!activeSessionsQuery.data) return;
    return Object.values(activeSessionsQuery.data);
  }, [activeSessionsQuery.data]);

  return (
    <div className="container gap-y-2 flex flex-col items-center py-20">
      <WcScanner onScan={(value) => setUri(value)} />
      {activeSessionsQuery.isLoading && <Skeleton className="w-full h-44" />}
      {activeSessionsQuery.isError && (
        <div className="text-red-500 font-medium">
          {activeSessionsQuery.error.message}
        </div>
      )}
      {activeSessionsQuery.isSuccess && (
        <>
          <div className="w-full max-w-xl">
            <Label htmlFor="uri">URI</Label>
            <Input
              id="uri"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
            />
          </div>
          <Button
            disabled={!uri || connectWcMutation.isPending}
            onClick={() =>
              connectWcMutation.connectWc({
                uri,
                onPair: async () => {
                  setUri('');
                  await activeSessionsQuery.refetch();
                },
              })
            }
          >
            {connectWcMutation.isPending ? 'Connecting...' : 'Connect'}
          </Button>
        </>
      )}
      {activeSessionsQuery.isSuccess && sessions && (
        <div className="flex mt-8 flex-col gap-y-8">
          {sessions.map((session) => (
            <Card className="w-full min-w-[500px]" key={session?.topic}>
              <CardHeader>
                <div className="flex items-center gap-x-2">
                  <Image
                    alt="logo"
                    className="rounded-lg"
                    src={
                      session.peer.metadata.icons[0] ?? '/images/logo-xl.png'
                    }
                    width={32}
                    height={32}
                  />
                  <div className="font-bold">{session.peer.metadata.name}</div>
                </div>
                <div className="text-xs">
                  {session.peer.metadata.description}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2">
                <Button
                  onClick={async () => {
                    await walletKitClient?.disconnectSession({
                      topic: session.topic,
                      reason: getSdkError('USER_DISCONNECTED'),
                    });
                    await activeSessionsQuery.refetch();
                  }}
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
