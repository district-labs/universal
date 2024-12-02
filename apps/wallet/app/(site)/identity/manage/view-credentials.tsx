'use client';
import { CredentialOAuth } from '@/components/identity/credential-oauth';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Skeleton } from '@/components/ui/skeleton';
import { credentialsApiClient } from '@/lib/api-credentials/client';
import { CREDENTIAL_OPTIONS } from 'app/settings';
import { useMemo } from 'react';
import { useGetCredentials } from 'universal-credential-sdk';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { useAccount, useChainId } from 'wagmi';

export function ViewCredentials() {
  const chainId = useChainId();
  const { address } = useAccount();

  const did = useMemo(
    () =>
      address
        ? constructDidIdentifier({
            chainId,
            address,
            resolver: universalDeployments.Resolver,
          })
        : undefined,
    [address, chainId],
  );

  const credentialsQuery = useGetCredentials(credentialsApiClient, {
    did,
  });

  return (
    <div className="flex h-full flex-col">
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
