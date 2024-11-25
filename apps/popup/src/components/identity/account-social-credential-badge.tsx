import { cn } from '@/lib/utils';
import type * as React from 'react';
import type { SocialCredential } from 'universal-data';
import type { Address } from 'viem';
import { Address as AddressRender } from '../onchain/address';
import { LinkComponent } from '../ui/link-component';
import { CredentialSocialIcon } from './credential-social-icon';

type AccountSocialCredentialBadge = React.HTMLAttributes<HTMLElement> & {
  address: Address;
  credentials: SocialCredential[];
};

export const AccountSocialCredentialBadge = ({
  className,
  address,
  credentials,
}: AccountSocialCredentialBadge) => {
  if (credentials.length === 0) {
    return (
      <AddressRender truncate={true} className="text-sm" address={address} />
    );
  }

  if (credentials.length > 0) {
    return credentials.map((credential) => {
      return (
        <LinkComponent
          key={credential.id}
          className={cn('flex items-center gap-x-1 text-sm', className)}
          href={credential.credential.credentialSubject.platformProfileUrl}
        >
          <CredentialSocialIcon
            type={credential.credential.credentialSubject.platform}
            size={12}
          />
          {credential.credential.credentialSubject.handle}
        </LinkComponent>
      );
    });
  }

  return null;
};
