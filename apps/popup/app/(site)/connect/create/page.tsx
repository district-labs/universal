'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createWebAuthnCredential,
  toWebAuthnAccount,
} from 'viem/account-abstraction';

import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { useAccountState } from '@/lib/state/use-account-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useSaveCredential } from '@/lib/pop-up/hooks/use-save-credential';
import { usePopUpMessage } from '@/lib/pop-up/hooks/use-pop-up-message';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBundlerClient } from '@/lib/state/use-bundler-client';

export default function Page() {
  const [name, setName] = useState<string>();
  const router = useRouter();
  const { accountState, setAccountState, removeAccountState } =
    useAccountState();
  const { saveCredentialAsync } = useSaveCredential({
    setAccountState,
    removeAccountState,
  });
  const { message } = usePopUpMessage();
  const bundlerClient = useBundlerClient();

  // If there's a registered AccountState or no method yet, show a loading page
  if (accountState || !message?.method) {
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-12" />
      </div>
    );
  }
  return (
    <section>
      <div className="flex flex-col gap-y-6 mx-auto max-w-screen-sm px-10">
        <div className="flex flex-col w-full gap-y-1.5">
          <Label className="font-bold" htmlFor="name">
            Account Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg py-7"
            id="name"
            placeholder="My account"
          />
        </div>
        <Button
          size="lg"
          className="rounded-full py-8 text-lg"
          disabled={!name || !bundlerClient}
          onClick={async () => {
            if (!name || !bundlerClient) return;
            const credential = await createWebAuthnCredential({
              name,
            });

            const owner = toWebAuthnAccount({
              credential,
            });
            const account = await toUniversalAccount({
              client: bundlerClient.client,
              owners: [owner],
            });

            await saveCredentialAsync({
              credentialId: credential.raw.id,
              publicKey: owner.publicKey,
              smartContractAddress: account.address,
            });
          }}
        >
          Create New Account
        </Button>
        <Button
          variant={'ghost'}
          size="sm"
          onClick={router.back}
          className="text-xs text-center cursor-pointer rounded-full"
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}
