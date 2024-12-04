import { RowBasic } from '@/components/core/row-basic';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import {
  type DelegationDb,
  useDelegationExecute,
  useDelegationStatus,
  useErc20TransferAmountEnforcer,
  useGetDelegations,
} from 'universal-delegations-sdk';
import { DebitCard } from 'universal-wallet-ui';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';
import { useAccount } from 'wagmi';

type ViewCreditTableProps = React.HTMLAttributes<HTMLElement> & {
  delegate: Address;
  chainId: number;
};

const ViewCreditTable = ({
  className,
  chainId,
  delegate,
}: ViewCreditTableProps) => {
  const { data } = useGetDelegations({
    delegate,
    chainId,
    type: 'DebitAuthorization',
  });

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-normal text-lg">No Active Credit Lines</h3>
      </Card>
    );
  }

  if (data?.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-normal text-lg">No Active Credit Lines</h3>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        className,
        'grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-3',
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
  const { address } = useAccount();
  const execute = useDelegationExecute();
  const { data: status } = useDelegationStatus({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  const { data: enforcerData } = useErc20TransferAmountEnforcer({
    delegationManager: delegation.verifyingContract,
    address: delegation.caveats[0].enforcer,
    delegation: delegation,
  });

  if (!enforcerData) {
    return <Skeleton className="h-72" />;
  }

  return (
    <Card key={delegation.hash} className={className}>
      <CardHeader className="flex items-center justify-center bg-neutral-100">
        <DebitCard
          to={delegation.delegate}
          amount={enforcerData.amountFormatted}
          name={enforcerData.name}
          symbol={enforcerData.symbol}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-3 border-t-2 pt-4">
        <RowBasic label="Status" value={status ? 'Disabled' : 'Active'} />
        <RowBasic label="From" value={delegation.delegator} />
        <RowBasic
          label="Asset"
          value={`${enforcerData.symbol} (${enforcerData.name})`}
        />
        <RowBasic
          label="Spent/Total"
          value={`${enforcerData?.spentFormatted}/${enforcerData?.amountFormatted}`}
        />
      </CardContent>
      <CardFooter className="border-t-2 pt-4">
        <Button
          className="w-full"
          rounded={'full'}
          variant={
            enforcerData.spendLimitReached
              ? 'default'
              : status
                ? 'outline'
                : 'emerald'
          }
          onClick={() => {
            !status &&
              !enforcerData.spendLimitReached &&
              execute({
                delegationManager: delegation.verifyingContract,
                delegation: delegation,
                executions: {
                  target: enforcerData.token,
                  calldata: encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [
                      address as Address,
                      BigInt(enforcerData.amount as bigint),
                    ],
                  }),
                  value: BigInt(0),
                },
              });
          }}
        >
          {enforcerData.spendLimitReached
            ? 'Spend Limit Reached'
            : status
              ? 'Disabled'
              : 'Claim Credit'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ViewCreditTable };
