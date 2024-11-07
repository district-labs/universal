import * as React from 'react';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { cn } from '@/lib/utils';

type ERC20Balance = React.HTMLAttributes<HTMLElement> & {
  address?: Address;
  account?: Address;
};

const ERC20Balance = ({ className, address, account }: ERC20Balance) => {
  const classes = cn(className);
  const { data } = useReadContract({
    abi: erc20Abi,
    address: address,
    functionName: 'balanceOf',
    args: [account as Address],
    query: {
      enabled: !!account,
      refetchInterval: 3000,
    },
  });

  if (!data) return '0';

  return <span className={classes}>{formatUnits(data, 18)}</span>;
};
export { ERC20Balance };