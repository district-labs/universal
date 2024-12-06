import { defaultChain } from '@/lib/chains';
import { ExternalLink } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Address as AddressType, Chain } from 'viem';
import { LinkComponent } from '../ui/link-component';

interface AccountExplorerLinkAddressProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  address?: AddressType;
  chain?: Chain;
}

export const AccountExplorerLink = ({
  address,
  className,
  chain = defaultChain,
}: AccountExplorerLinkAddressProps) => {
  const blockExplorerUrl = chain.blockExplorers?.default.url;

  if (blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal={true}
        className={className}
        href={`${blockExplorerUrl}/address/${address}`}
      >
        <ExternalLink className="ml-1 inline-block size-4" />
      </LinkComponent>
    );
  }

  return null;
};
