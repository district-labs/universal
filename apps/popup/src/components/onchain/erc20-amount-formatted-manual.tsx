'use client';

import type * as React from 'react';
import { formatUnits } from 'viem';

import { cn } from '@/lib/utils';

type ERC20AmountFormattedManual = React.HTMLAttributes<HTMLElement> & {
  amount: number;
  decimals: number;
};

const ERC20AmountFormattedManual = ({
  className,
  amount,
  decimals,
}: ERC20AmountFormattedManual) => {
  return (
    <span className={cn(className)}>
      {formatUnits(BigInt(amount), decimals)}
    </span>
  );
};
export { ERC20AmountFormattedManual };
