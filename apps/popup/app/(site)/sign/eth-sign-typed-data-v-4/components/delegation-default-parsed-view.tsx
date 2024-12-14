import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { universalDeployments } from 'universal-data';
import type { Delegation } from 'universal-types';
import type { Chain } from 'viem';
import { CardPaymentBasic } from './card-payment-basic';
import { ERC20SwapAuthorization } from './erc20-swap-authorization';

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
    console.log(typedData.caveats[0], 'typedData.caveats[0]');
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
        case universalDeployments.ERC20BalanceGteWrapEnforcer:
          return 'ERC20Swap';
        default:
          return 'Default';
      }
    }
    if (typedData.caveats.length === 3) {
      switch (typedData.caveats[0].enforcer) {
        case universalDeployments.ERC20BalanceGteWrapEnforcer:
          return 'ERC20Swap';
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

  if (delegationType === 'ERC20Swap') {
    return (
      <div className={cn(className)}>
        <ERC20SwapAuthorization typedData={typedData} chainId={chainId} />
      </div>
    );
  }

  return <div className={cn(className)}>{children}</div>;
};
