import { cn } from '@/lib/utils';
import makeBlockie from 'ethereum-blockies-base64';
import type * as React from 'react';
import type { Address } from 'viem';

type WalletPFP = React.HTMLAttributes<HTMLElement> & {
  address?: Address;
};

const WalletPFP = ({ className, address }: WalletPFP) => {
  if (!address) {
    return null;
  }

  return (
    <img alt={address} className={cn(className)} src={makeBlockie(address)} />
  );
};
export { WalletPFP };
