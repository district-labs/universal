import { type HTMLAttributes, useMemo } from 'react';
import type { Address as AddressType, Chain } from 'viem';

import { baseSepolia } from 'viem/chains';
import { LinkComponent } from '../ui/link-component';

interface AccountAddressAddressProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  address?: AddressType;
  truncate?: boolean;
  truncateLength?: number;
  isLink?: boolean;
  chain?: Chain;
}

export const AccountAddress = ({
  address,
  className,
  truncate,
  truncateLength = 8,
  isLink,
  chain = baseSepolia,
  ...props
}: AccountAddressAddressProps) => {
  const blockExplorerUrl = chain.blockExplorers?.default.url;
  const formattedAddress = useMemo(
    () =>
      truncate
        ? `${address?.slice(0, truncateLength + 2)}...${address?.slice(-truncateLength)}`
        : address,
    [address, truncate, truncateLength],
  );

  if (isLink && blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal={true}
        className={className}
        href={`${blockExplorerUrl}/address/${address}`}
        {...props}
      >
        {formattedAddress}
      </LinkComponent>
    );
  }

  return (
    <span className={className} {...props}>
      {formattedAddress}
    </span>
  );
};
