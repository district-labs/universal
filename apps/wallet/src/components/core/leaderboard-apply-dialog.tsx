import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { credentialsApiClient } from '@/lib/api-credentials/client';
import { useToast } from '@/lib/hooks/use-toast';
import { CREDENTIAL_OPTIONS } from 'app/settings';
import { Orbit } from 'lucide-react';
import type * as React from 'react';
import { useMemo } from 'react';
import { useGetCredentials } from 'universal-credential-sdk';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { useInsertAccount, useUniversalMessageSign } from 'universal-sdk';
import { useAccount } from 'wagmi';
import { CredentialOAuthSmall } from '../identity/credential-oauth-small';
import { ConnectUniversalWalletButton } from '../onchain/connect-universal-wallet';
import { IsWalletConnected } from '../onchain/is-wallet-connected';
import { IsWalletDisconnected } from '../onchain/is-wallet-disconnected';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type LeaderboardApplyDialogProps = React.HTMLAttributes<HTMLElement>;

export const LeaderboardApplyDialog = ({
  children,
}: LeaderboardApplyDialogProps) => {
  const { toast } = useToast();
  const { address, chainId } = useAccount();

  const { mutateAsync } = useInsertAccount();
  const { signTypedDataAsync } = useUniversalMessageSign();

  async function signVerificationRequestAsync() {
    if (!address) {
      return;
    }
    try {
      const _signature = await signTypedDataAsync({
        content: "I want to discover what's possible in the Universal Network.",
      });

      await mutateAsync({
        chainId: chainId as number,
        address: address,
        signature: _signature,
      });
      toast({
        title: 'Success',
        description: 'Successfully applied for UNV beta.',
      });
    } catch (error: unknown) {
      const knownError = error as Error;
      console.error(knownError.message);
      if (knownError?.message.includes('User rejected the request.')) {
        toast({
          title: 'Cancelled',
          description: 'Universal Message signature request cancelled.',
        });
        return;
      }

      toast({
        title: 'Previously Registered',
        description: 'You have already applied for UNV beta.',
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
      <DialogContent className="px-10 pt-10 pb-14 md:max-w-screen-md">
        <div className="grid grid-cols-1 gap-x-5">
          <DialogHeader className="sm:text-center">
            <Orbit className="mx-auto size-12" />
            <DialogTitle className="font-black text-4xl">
              {/* <span className="text-5xl">🤑 </span> */}
              <span className="inline-block">Universal Trust Network</span>
            </DialogTitle>
            <DialogDescription className=" text-base">
              Join us in a <span className="font-bold">wild experiment</span> to
              discover <span className="font-bold">what's possible</span>.
              {/* Join the <span className="font-bold">wild experiment</span> to
              kickstart a <span className="font-bold">Universal Credit</span>{' '}
              network! */}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-5">
            <ViewCredentials />
            <p className="text-center text-xs">
              We recommend verifying your social accounts before applying.{' '}
              <br /> This will help us verify your identity and increase your
              chances of being accepted.
            </p>
          </div>
        </div>
        <IsWalletDisconnected>
          <ConnectUniversalWalletButton
            size="lg"
            className="rounded-full py-3 text-lg"
          >
            Connect Universal Wallet
          </ConnectUniversalWalletButton>
        </IsWalletDisconnected>
        <IsWalletConnected>
          <Button
            className="mx-auto w-full max-w-lg text-lg"
            rounded={'full'}
            size={'lg'}
            onClick={signVerificationRequestAsync}
          >
            Apply to Join Early Beta
          </Button>
        </IsWalletConnected>
      </DialogContent>
    </Dialog>
  );
};

export function ViewCredentials() {
  const { address, chainId } = useAccount();

  const did = useMemo(
    () =>
      address
        ? constructDidIdentifier({
            chainId: chainId as number,
            address,
            resolver: universalDeployments?.[chainId as number]?.resolver,
          })
        : undefined,
    [address, chainId],
  );

  const credentialsQuery = useGetCredentials(credentialsApiClient, {
    did,
  });

  return (
    <div className="">
      <IsWalletDisconnected>
        <div className="flex flex-col items-center justify-center gap-y-4 ">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={String(i)} className="h-14 w-full" />
          ))}
        </div>
      </IsWalletDisconnected>
      <IsWalletConnected>
        <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-y-2">
          {credentialsQuery.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={String(i)} className="h-10 w-full" />
            ))}
          {!credentialsQuery.isLoading &&
            CREDENTIAL_OPTIONS.map((credential) => (
              <CredentialOAuthSmall
                {...credential}
                className="p-2"
                did={did}
                key={credential.title}
                // @ts-expect-error We need to fix the typing for this
                credential={credentialsQuery.data?.find(
                  (c) => c.type === credential.type,
                )}
              />
            ))}
        </div>
      </IsWalletConnected>
    </div>
  );
}
