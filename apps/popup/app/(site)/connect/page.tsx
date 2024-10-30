'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { toHex } from 'viem';
import { sign } from 'webauthn-p256';
import { usePopUpMessage } from '../../../src/lib/pop-up/hooks/use-pop-up-message';
import { useAccountState } from '@/lib/state/use-account-state';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from 'app/config';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getInitialOwners } from '@/lib/db/hooks/use-get-initial-owner';

export default function Page() {
  const { accountState, setAccountState, removeAccountState } =
    useAccountState();
  const { message } = usePopUpMessage();

  // If there's a registered AccountState or no method yet, show a loading page
  if (accountState || !message?.method) {
    return (
      <div className="flex flex-1 w-full flex-col justify-between h-full">
        <div className="text-center bg-neutral-00 w-full py-6 z-50 relative">
          <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
          <h4 className="text-sm font-normal mt-1">
            {siteConfig.description}{' '}
          </h4>
        </div>
        <div className="px-32 max-w-screen-sm mx-auto w-full">
          <hr className="border-neutral-300 rounded-full w-full shadow-xl" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-12 z-10 gap-y-5 mx-auto max-w-screen-sm w-full">
          <Skeleton className="h-14 rounded-full w-full" />
          <Skeleton className="h-14 rounded-full w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 w-full flex-col justify-between h-full">
      <div className="text-center bg-neutral-00 w-full py-6 z-50 relative">
        <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
        <h4 className="text-sm font-normal mt-1">{siteConfig.description} </h4>
      </div>
      <div className="px-32 max-w-screen-sm mx-auto w-full">
        <hr className="border-neutral-300 rounded-full w-full shadow-xl" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-12 z-10 gap-y-5 mx-auto max-w-screen-sm w-full">
        <Button
          size="lg"
          className="rounded-full py-8 text-lg w-full"
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
            'rounded-full py-8 text-lg w-full',
          )}
          href="/connect/create"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
}
