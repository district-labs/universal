import React from 'react';
import type { HTMLAttributes } from 'react';
import type { Address as AddressType } from 'viem';
import { baseSepolia } from 'viem/chains';
import { LinkComponent } from '../ui/link-component';

interface AddressProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  address: AddressType;
  truncate?: boolean;
  truncateLength?: number;
  isLink?: boolean;
}

export const Address = ({
  address,
  className,
  truncate,
  truncateLength = 8,
  isLink,
  ...props
}: AddressProps) => {
  // TODO: Accept chain param here
  const blockExplorerUrl = baseSepolia?.blockExplorers?.default.url;
  const formattedAddress = truncate
    ? `${address?.slice(0, truncateLength)}...${address?.slice(-(truncateLength - 2))}`
    : address;

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
