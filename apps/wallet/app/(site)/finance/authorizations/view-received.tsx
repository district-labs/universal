import type * as React from 'react';
import { cn } from '@/lib/utils';
import {
  useDelegationExecute,
  useDelegationStatus,
  useErc20TransferAmountEnforcer,
  useGetDelegationByDelegateAndType,
} from 'universal-delegations-sdk';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { RowBasic } from '@/components/row-basic';
import { DebitCard } from 'universal-wallet-ui';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

type ViewReceived = React.HTMLAttributes<HTMLElement> & {
  delegate: Address;
};

const ViewReceived = ({ className, delegate }: ViewReceived) => {
  const { data } = useGetDelegationByDelegateAndType({
    address: delegate,
    type: 'DebitAuthorization',
  });

  if (!data) {
    return null;
  }

  return (
    <div
      className={cn(
        className,
        'grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3',
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
  delegation: any;
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
      <CardContent className='flex flex-col gap-y-3 border-t-2 pt-4'>
        <RowBasic label="Status" value={!!status ? 'Disabled' : 'Active'} />
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
              : !!status
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
            : !!status
              ? 'Disabled'
              : 'Claim Credit'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ViewReceived };
