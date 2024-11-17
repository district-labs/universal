'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitialOwners } from '@/lib/db/hooks/use-get-initial-owner';
import { useAccountState } from '@/lib/state/use-account-state';
import { cn } from '@/lib/utils';
import { siteConfig } from 'app/config';
import Link from 'next/link';
import { toHex } from 'viem';
import { sign } from 'webauthn-p256';
import { usePopUpMessage } from '../../../src/lib/pop-up/hooks/use-pop-up-message';

export default function Page() {
  const { accountState, setAccountState } = useAccountState();
  const { message } = usePopUpMessage();

  // If there's a registered AccountState or no method yet, show a loading page
  if (accountState || !message?.method) {
    return (
      <div className="flex h-full w-full flex-1 flex-col justify-between">
        <div className="relative z-50 w-full bg-neutral-00 py-6 text-center">
          <h1 className="font-bold text-2xl">{siteConfig.name}</h1>
        </div>
        <div className="z-10 mx-auto flex w-full max-w-screen-sm flex-1 flex-col items-center justify-center gap-y-5 px-12">
          <Skeleton className="h-16 w-full rounded-full" />
          <Skeleton className="h-16 w-full rounded-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-1 flex-col justify-between">
      <div className="relative z-50 w-full bg-neutral-00 py-6 text-center">
        <h1 className="font-bold text-2xl">{siteConfig.name}</h1>
      </div>
      <div className="z-10 mx-auto flex w-full max-w-screen-sm flex-1 flex-col items-center justify-center gap-y-5 px-12">
        <Button
          size="lg"
          className="w-full rounded-full py-8 text-lg"
          variant={'default'}
          onClick={async () => {
            // TODO: Add random challenge generation
            const challenge = new Uint8Array(32);
            const credential = await sign({
              hash: toHex(challenge),
            });

            const storedCredential = await getInitialOwners({
              mode: 'credentialId',
              credentialId: credential.raw.id,
            });

            if (!storedCredential) {
              return;
            }

            // @ts-expect-error
            setAccountState(storedCredential);
          }}
        >
          Sign In
        </Button>
        <Link
          className={cn(
            buttonVariants({
              size: 'lg',
              variant: 'outline',
            }),
            'w-full rounded-full py-8 text-lg',
          )}
          href="/connect/create"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
}
