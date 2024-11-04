import * as React from 'react';
import { cn } from '@/lib/utils';
import { Delegation } from '@/lib/delegation-framework/types';
import { Address, decodeAbiParameters, formatUnits } from 'viem';
import { DebitCard } from 'universal-wallet-ui';
import { findToken } from 'universal-wallet-data';
import { RowBasic } from '@/components/row-basic';

type CardPaymentBasic = React.HTMLAttributes<HTMLElement> & {
  typedData: Delegation;
  chainId: number;
};

const CardPaymentBasic = ({ className, typedData, chainId }: CardPaymentBasic) => {
  const data = React.useMemo(() => {
    const formattedTerms = decodeAbiParameters(
      [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint255' },
      ],
      typedData.caveats[0].terms,
    );

    const token = findToken(chainId, formattedTerms[0] as Address);
    if (!token) {
      // TODO: handle unknown token by fetching token data
      return {
        to: typedData.delegate,
        token: formattedTerms[0] as Address,
        amount: formattedTerms[1] as number,
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18,
      };
    };
    return {
      to: typedData.delegate,
      token: formattedTerms[0] as Address,
      amount: formattedTerms[1] as number,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    };
  }, [typedData]);

  return (
    <div className={cn(className)}>
      <div className="pb-6">
        <DebitCard
          amount={formatUnits(BigInt(data.amount), 18).toString()}
          tokenAddress={data.token}
          chainId={chainId}
          to={data.to}
          symbol={data.symbol}
          name={data.name}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <RowBasic label="To" value={data.to} />
        <RowBasic label="Asset" value={data.token} />
        <RowBasic
          label="Amount"
          value={formatUnits(BigInt(data.amount), data.decimals)}
        />
        <RowBasic label="Expiration" value={"Never"} />
      </div>
    </div>
  );
};

export { CardPaymentBasic };