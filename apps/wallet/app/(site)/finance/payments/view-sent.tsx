import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  decodeEnforcerERC20TransferAmount,
  useGetDelegationByDelegatorAndType,
} from 'universal-wallet-delegations';
import { Address, formatUnits } from 'viem';
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
        return <CardAuthorization delegation={delegation} />;
      })}
    </div>
  );
};

type CardAuthorization = React.HTMLAttributes<HTMLElement> & {
  delegation: any;
};

const CardAuthorization = ({ className, delegation }: CardAuthorization) => {
  const data = React.useMemo(() => {
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
        <RowBasic label="To" value={delegation.delegate} />
        <RowBasic label="Asset" value={data.symbol} />
        <RowBasic label="Amount" value={data.amountFormatted} />
        <RowBasic label="Expiration" value={'Never'} />
      </CardContent>
      <CardFooter className="border-t-2 pt-4">
        <Button className="w-full" rounded={'full'}>
          Revoke
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ViewSent };
