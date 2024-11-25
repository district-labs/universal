import type * as React from 'react';
import { type Address, formatUnits } from 'viem';

import { cn } from '@/lib/utils';

type EthAmountFormatted = React.HTMLAttributes<HTMLElement> & {
  amount: bigint | number | undefined;
  address?: Address;
};

export const EthAmountFormatted = ({
  className,
  amount,
}: EthAmountFormatted) => {
  return (
    <span className={cn(className)}>
      {formatUnits(BigInt(amount ?? 0), 18)} Ξ
    </span>
  );
};
