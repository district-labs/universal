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
          <div>
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
                  setUri(undefined);
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
            <div key={session?.topic} className="flex flex-col gap-y-2">
              <div className="font-bold">{session.topic}</div>
              <Button
                onClick={async () => {
                  await walletKitClient.disconnectSession({
                    topic: session.topic,
                    reason: getSdkError('USER_DISCONNECTED'),
                  });
                  await activeSessionsQuery.refetch();
                }}
              >
                Disconnect
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
