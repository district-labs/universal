'use client';

import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { CredentialOAuth } from '@/components/identity/credential-oauth';
import { ConnectButton } from '@/components/onchain/connect-button';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { SvgIcon } from '@/components/svg-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useGetCredentials } from 'universal-credential-sdk';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { useAccount } from 'wagmi';

const CREDENTIAL_OPTIONS = [
  {
    type: 'x',
    icon: <SvgIcon src={XIcon} height={42} width={42} color="black" />,
    title: 'X (Formerly Twitter)',
    description: 'Verify your X account.',
  },
  {
    type: 'github',
    icon: <SvgIcon src={GithubIcon} height={42} width={42} color="#3e3e3e" />,
    title: 'Github',
    description: 'Verify your Github account.',
  },
  {
    type: 'discord',
    icon: <SvgIcon src={DiscordIcon} height={42} width={42} color="#3e3e3e" />,
    title: 'Discord',
    description: 'Verify your Discord account.',
  },
];

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
    <>
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl md:text-3xl">
            Universal Credentials
          </h3>
          <p className="">
            Verify your online accounts to create a universal identity.
          </p>
        </div>
      </section>
      <IsWalletDisconnected>
        <div className="flex flex-col items-center justify-center gap-4 p-10">
          <ConnectButton>Connect Wallet</ConnectButton>
          <p className="">
            Connect your wallet to view and manage your credentials.
          </p>
        </div>
      </IsWalletDisconnected>
      <IsWalletConnected>
        <section className="py-8">
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
    </>
  );
}
