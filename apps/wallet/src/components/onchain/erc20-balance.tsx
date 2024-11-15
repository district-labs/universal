import type * as React from 'react';
import { type Address, erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { cn, formatNumber } from '@/lib/utils';

export type ERC20Balance = React.HTMLAttributes<HTMLElement> & {
  address?: Address;
  account?: Address;
};

export const ERC20Balance = ({ className, address, account }: ERC20Balance) => {
  const { address: user } = useAccount();
  const classes = cn(className);
  const { data } = useReadContract({
    abi: erc20Abi,
    address: address,
    functionName: 'balanceOf',
    args: [account || (user as Address)],
    query: {
      enabled: !!account || !!user,
      refetchInterval: 3000,
    },
  });

  if (!data) {
    return <span className={classes}>0</span>;
  }

  return <span className={classes}>{formatNumber(formatUnits(data, 18))}</span>;
};
