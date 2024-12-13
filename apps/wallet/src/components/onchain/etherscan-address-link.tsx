import { defaultChain } from '@/lib/chains';
import type { Address as AddressType, Chain } from 'viem';
import { LinkComponent } from '../ui/link-component';

type ExplorerAddressLinkProps = React.HTMLAttributes<HTMLElement> & {
  address?: AddressType | string;
  chain?: Chain;
};

export const ExplorerAddressLink = ({
  children,
  address,
  className,
  chain = defaultChain,
}: ExplorerAddressLinkProps) => {
  const blockExplorerUrl = chain.blockExplorers?.default.url;

  if (blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal={true}
        className={className}
        href={`${blockExplorerUrl}/address/${address}`}
      >
        {children}
      </LinkComponent>
    );
  }

  return null;
};
