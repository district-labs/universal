import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ANY_DELEGATE,
  decodeEnforcerERC20TransferAmount,
  useDelegationExecute,
  useGetDelegationByDelegateAndType,
} from 'universal-wallet-delegations';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  zeroAddress,
} from 'viem';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { RowBasic } from '@/components/row-basic';
import { DebitCard } from 'universal-wallet-ui';
import { findToken } from 'universal-wallet-data';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

type ViewReceived = React.HTMLAttributes<HTMLElement> & {
  delegate: Address;
};

const ViewReceived = ({ className, delegate }: ViewReceived) => {
  const { data } = useGetDelegationByDelegateAndType({
    // address: '0x0000000000000000000000000000000000000a11',
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
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10',
      )}
    >
      {data.map((delegation) => {
        return <CardAuthorization delegation={delegation} />;
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

  const data = React.useMemo(() => {
    if (delegation.caveats.length === 0) {
      return {
        to: ANY_DELEGATE,
        token: zeroAddress as Address,
        amount: 0,
        amountFormatted: '0',
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18,
      };
    }
    const decodedTerms = decodeEnforcerERC20TransferAmount(
      delegation.caveats[0].terms,
    );
    const token = findToken(delegation.chainId, decodedTerms[0] as Address);
    if (!token) {
      // TODO: handle unknown token by fetching token data
      return {
        to: delegation.delegate,
        token: decodedTerms[0] as Address,
        amount: decodedTerms[1],
        amountFormatted: formatUnits(BigInt(decodedTerms[1]), 18),
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18,
      };
    }
    return {
      to: delegation.delegate,
      token: decodedTerms[0] as Address,
      amount: decodedTerms[1],
      amountFormatted: formatUnits(BigInt(decodedTerms[1]), token.decimals),
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    };
  }, [delegation]);

  return (
    <Card key={delegation.hash} className={className}>
      <CardHeader className="bg-neutral-100">
        <DebitCard
          color="green"
          to={delegation.delegate}
          amount={data.amountFormatted}
          name={data.name}
          symbol={data.symbol}
        />
      </CardHeader>
      <CardContent className="border-t-2 pt-4 flex flex-col gap-y-2">
        <RowBasic label="From" value={delegation.delegator} />
        <RowBasic label="To" value={delegation.delegate} />
        <RowBasic label="Asset" value={`${data.symbol} (${data.name})`} />
        <RowBasic label="Amount" value={data.amountFormatted} />
        <RowBasic label="Expiration" value={'Never'} />
      </CardContent>
      <CardFooter className="border-t-2 pt-4">
        <Button
          className="w-full"
          rounded={'full'}
          onClick={() => {
            execute({
              delegationManager: delegation.verifyingContract,
              delegation: delegation,
              executions: {
                target: data.token,
                calldata: encodeFunctionData({
                  abi: erc20Abi,
                  functionName: 'transfer',
                  args: [address as Address, BigInt(data.amount)],
                }),
                value: BigInt(0),
              },
            });
          }}
        >
          Claim
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ViewReceived };
