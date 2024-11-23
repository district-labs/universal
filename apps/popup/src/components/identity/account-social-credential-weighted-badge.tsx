import { cn } from '@/lib/utils';
import type * as React from 'react';
import type { SocialCredential } from 'universal-data';
import type { Address } from 'viem';
import { Address as AddressRender } from '../onchain/address';
import { LinkComponent } from '../ui/link-component';
import { CredentialSocialIcon } from './credential-social-icon';

type AccountSocialCredentialWeightedBadge =
  React.HTMLAttributes<HTMLElement> & {
    address: Address;
    credentials: SocialCredential[];
  };

export const AccountSocialCredentialWeightedBadge = ({
  className,
  address,
  credentials,
}: AccountSocialCredentialWeightedBadge) => {
  const highestWeightedCredential = findHighestWeightedCredential(credentials);

  if (!highestWeightedCredential) {
    return <AddressRender address={address} />;
  }
  return (
    <LinkComponent
      className={cn('flex items-center gap-x-1', className)}
      href={
        highestWeightedCredential.credential.credentialSubject
          .platformProfileUrl
      }
    >
      <CredentialSocialIcon
        type={highestWeightedCredential.credential.credentialSubject.platform}
        size={12}
      />
      {highestWeightedCredential.credential.credentialSubject.handle}
    </LinkComponent>
  );
};

const PLATFORM_WEIGHTS: Record<string, number> = {
  x: 1,
  github: 2,
  discord: 3,
};

function findHighestWeightedCredential(
  credentials: SocialCredential[],
): SocialCredential | null {
  if (credentials.length === 0) {
    return null;
  }
  return credentials.reduce((highest, current) => {
    const currentWeight =
      PLATFORM_WEIGHTS[current.credential.credentialSubject.platform] ||
      Number.POSITIVE_INFINITY;
    const highestWeight =
      PLATFORM_WEIGHTS[highest.credential.credentialSubject.platform] ||
      Number.POSITIVE_INFINITY;

    // Return the credential with the lower weight (higher priority)
    return currentWeight < highestWeight ? current : highest;
  }, credentials[0]); // Initialize with the first credential
}
