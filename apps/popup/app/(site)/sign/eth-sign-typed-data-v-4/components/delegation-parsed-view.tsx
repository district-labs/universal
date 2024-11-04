import * as React from 'react';
import { cn } from '@/lib/utils';
import { Delegation } from '@/lib/delegation-framework/types';
import { delegationFrameworkDeployments } from 'universal-wallet-delegations';
import { Chain } from 'viem';
import { CardPaymentBasic } from './card-payment-basic';

type DelegationParsedView = React.HTMLAttributes<HTMLElement> & {
  chainId: Chain['id'];
  typedData: Delegation;
};

const DelegationParsedView = ({
  children,
  className,
  typedData,
  chainId,
}: DelegationParsedView) => {
  const delegationType = React.useMemo(() => {
    if (!typedData) return;
    if (typedData.caveats.length === 0) return;
    if (typedData.caveats.length === 1) {
      switch (typedData.caveats[0].enforcer) {
        case delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount:
          return 'CardPayment';
        case delegationFrameworkDeployments[chainId].enforcerNativeTokenTransferAmount:
          return 'CardPayment';
        default:
          return 'Default';
      }
    }
  }, [typedData]);

  if (!delegationType) return 'Unknown';

  if (delegationType === 'CardPayment') {
    return <CardPaymentBasic typedData={typedData} chainId={chainId} />;
  }
  return <div className={cn(className)}>{children}</div>;
};

export { DelegationParsedView };
