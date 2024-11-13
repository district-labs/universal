import type { Delegation } from '@/lib/delegation-framework/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { delegationFrameworkDeployments } from 'universal-delegations-sdk';
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
        case delegationFrameworkDeployments[chainId]
          .ERC20TransferAmountEnforcer:
        case delegationFrameworkDeployments[chainId].NativeTokenPaymentEnforcer:
          return 'CardPayment';
        default:
          return 'Default';
      }
    }
  }, [typedData, chainId]);

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
