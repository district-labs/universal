import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DelegationDb,
  useDelegationStatus,
  useDisableDelegation,
  useEnableDelegation,
  useErc20TransferAmountEnforcer,
  useGetDelegationByDelegatorAndType,
} from 'universal-delegations-sdk';
import { Address } from 'viem';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { RowBasic } from '@/components/row-basic';
import { DebitCard } from 'universal-wallet-ui';
import { Button } from '@/components/ui/button';

type ViewSent = React.HTMLAttributes<HTMLElement> & {
  delegator: Address;
};

const ViewSent = ({ className, delegator }: ViewSent) => {
  const { data } = useGetDelegationByDelegatorAndType({
    address: delegator,
    type: 'DebitAuthorization',
  });

  if (!data) {
    return null;
  }

  return (
    <div
      className={cn(
        className,
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10',
      )}
    >
      {data.map((delegation) => {
        return (
          <CardAuthorization key={delegation.hash} delegation={delegation} />
        );
      })}
    </div>
  );
};

type CardAuthorization = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationDb;
};

const CardAuthorization = ({ className, delegation }: CardAuthorization) => {
  const { data: status } = useDelegationStatus({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  const { disable } = useDisableDelegation({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });
  const { enable } = useEnableDelegation({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  const { data: enforcerData } = useErc20TransferAmountEnforcer({
    delegationManager: delegation.verifyingContract,
    address: delegation.caveats[0].enforcer,
    delegation: delegation,
  });

  if (!enforcerData) return null;

  return (
    <Card key={delegation.hash} className={className}>
      <CardHeader className="bg-neutral-100">
        <DebitCard
          color="green"
          to={delegation.delegate}
          amount={enforcerData.amountFormatted}
          name={enforcerData.name}
          symbol={enforcerData.symbol}
        />
      </CardHeader>
      <CardContent className="border-t-2 pt-4 flex flex-col gap-y-3">
        <RowBasic label="Status" value={!!status ? 'Disabled' : 'Active'} />
        <RowBasic label="To" value={delegation.delegate} />
        <RowBasic
          label="Asset"
          value={`${enforcerData.symbol} (${enforcerData.name})`}
        />
        {/* <RowBasic label="Expiration" value={'Never'} /> */}
        <RowBasic
          label="Spent/Total"
          value={`${enforcerData?.spentFormatted}/${enforcerData?.amountFormatted}`}
        />
      </CardContent>
      <CardFooter className="border-t-2 pt-4">
        <div className="w-full flex flex-col gap-y-2">
          <Button
            onClick={!!status ? enable : disable}
            className="w-full"
            rounded={'full'}
            variant={!!status ? 'emerald' : 'destructive'}
          >
            {!!status ? 'Re-activate Credit Line' : 'Disable Credit Line'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewSent };
