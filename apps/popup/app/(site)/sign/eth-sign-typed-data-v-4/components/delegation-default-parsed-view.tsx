import type { Delegation } from 'universal-types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { universalDeployments } from 'universal-data';
import type { Chain } from 'viem';
import { CardPaymentBasic } from './card-payment-basic';

export type DelegationDefaultParsedView = React.HTMLAttributes<HTMLElement> & {
  chainId: Chain['id'];
  typedData: Delegation;
};

export const DelegationDefaultParsedView = ({
  children,
  className,
  typedData,
  chainId,
}: DelegationDefaultParsedView) => {
  const delegationType = useMemo(() => {
    if (!typedData) {
      return;
    }
    if (typedData.caveats.length === 0) {
      return;
    }
    if (typedData.caveats.length === 1) {
      switch (typedData.caveats[0].enforcer) {
        case universalDeployments.ERC20TransferAmountEnforcer:
        case universalDeployments.NativeTokenPaymentEnforcer:
          return 'CardPayment';
        default:
          return 'Default';
      }
    }
  }, [typedData]);

  if (!delegationType) {
    return 'Unknown';
  }

  if (delegationType === 'CardPayment') {
    return (
      <div className={cn(className)}>
        <CardPaymentBasic typedData={typedData} chainId={chainId} />
      </div>
    );
  }
  return <div className={cn(className)}>{children}</div>;
};
