'use client';
import { CredentialOAuth } from '@/components/identity/credential-oauth';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Skeleton } from '@/components/ui/skeleton';
import { CREDENTIAL_OPTIONS } from 'app/settings';
import { useMemo } from 'react';
import { useGetCredentials } from 'universal-credential-sdk';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { useAccount } from 'wagmi';

export function ViewCredentials() {
  const { address, chainId } = useAccount();

  const did = useMemo(
    () =>
      address
        ? constructDidIdentifier({
            chainId: chainId as number,
            address,
            resolver: universalDeployments?.[chainId as number].resolver,
          })
        : undefined,
    [address, chainId],
  );

  const credentialsQuery = useGetCredentials({
    did,
  });

  return (
    <div className="flex h-full flex-col">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl">Universal Credentials</h3>
          <p className="hidden md:block">
            Verify your online accounts to create a universal identity.
          </p>
        </div>
      </section>
      <IsWalletDisconnected>
        <div className="flex flex-col items-center justify-center pt-6">
          <ConnectUniversalWalletButton
            size="lg"
            className="rounded-full py-3 text-lg"
          >
            Connect Universal Wallet
          </ConnectUniversalWalletButton>
        </div>
      </IsWalletDisconnected>
      <IsWalletConnected>
        <section className="flex-1 bg-neutral-100 pt-6">
          <div className="2xl container mx-auto grid grid-cols-1 gap-x-5 lg:grid-cols-3">
            {credentialsQuery.isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={String(i)} className="h-72 w-full" />
              ))}
            {!credentialsQuery.isLoading &&
              CREDENTIAL_OPTIONS.map((credential) => (
                <CredentialOAuth
                  {...credential}
                  did={did}
                  key={credential.title}
                  className="mb-6"
                  // @ts-expect-error We need to fix the typing for this
                  credential={credentialsQuery.data?.find(
                    (c) => c.type === credential.type,
                  )}
                />
              ))}
          </div>
        </section>
      </IsWalletConnected>
    </div>
  );
}
