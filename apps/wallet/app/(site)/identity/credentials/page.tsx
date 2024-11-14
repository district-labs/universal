'use client';

import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { CredentialOAuth } from '@/components/identity/credential-oauth';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCredentials } from 'universal-credential-sdk';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { baseSepolia } from 'viem/chains';

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
    description:
      'Verify your Github account.',
  },
  {
    type: 'discord',
    icon: <SvgIcon src={DiscordIcon} height={42} width={42} color="purple" />,
    title: 'Discord',
    description: 'Verify your Discord account.',
  },
];

// TODO: make resolver dynamic
const resolver = '0x305f57c997A35E79F6a59CF09A9d07d2408b5935';

export default function IdentityCredentialsPage() {
  const { address } = useAccount();

  const did = useMemo(
    () =>
      address
        ? constructDidIdentifier({
            chainId: baseSepolia.id,
            address,
            resolver,
          })
        : undefined,
    [address],
  );

  const credentialsQuery = useGetCredentials({
    did,
  });

  const missingCredentialOptions = useMemo(() => {
    if (!credentialsQuery.data) {
      return CREDENTIAL_OPTIONS;
    }

    // Filter out credentials that are already claimed
    return CREDENTIAL_OPTIONS.filter(
      (credential) =>
        !credentialsQuery.data?.some(
          (claimedCredential) => claimedCredential.type === credential.type,
        ),
    );
  }, [credentialsQuery.data]);

  return (
    <>
      <section className="border-b-2 bg-neutral-100 py-6">
        <div className="container mx-auto max-w-screen-xl py-10">
          <h3 className="font-bold text-3xl">Universal Credentials</h3>
          <p className="">
            Unlock the full potential of your online identity with universal
            credentials.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-x-5 lg:grid-cols-3">
          {credentialsQuery.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={String(i)} className="w-full h-72" />
            ))}
          {!credentialsQuery.isLoading &&
            missingCredentialOptions.map((credential) => (
              <CredentialOAuth
                {...credential}
                did={did}
                key={credential.title}
                className="mb-6"
              />
            ))}
        </div>
        <h2 className="px-10 mb-4 mt-6 text-2xl font-bold">
          Created Credentials
        </h2>
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-x-5 lg:grid-cols-3">
          {credentialsQuery.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={String(i)} className="w-full h-72" />
            ))}
          {!credentialsQuery.isLoading &&
            credentialsQuery.data?.map((credential) => (
              <Card key={credential.id}>
                <CardHeader className="pb-2 text-lg capitalize font-bold">
                  {credential.type}
                </CardHeader>
                <CardContent>
                  <pre className="w-full max-w-full overflow-auto">
                    {JSON.stringify(credential, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </>
  );
}
