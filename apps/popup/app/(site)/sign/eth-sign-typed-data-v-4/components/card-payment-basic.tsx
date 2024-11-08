import * as React from 'react';
import { cn } from '@/lib/utils';
import { Delegation } from '@/lib/delegation-framework/types';
import { Address, formatUnits } from 'viem';
import { DebitCard } from 'universal-wallet-ui';
import { findToken } from 'universal-wallet-data';
import { RowBasic } from '@/components/row-basic';
import { decodeEnforcerERC20TransferAmount } from 'universal-wallet-delegations';

type CardPaymentBasic = React.HTMLAttributes<HTMLElement> & {
  typedData: Delegation;
  chainId: number;
};

const CardPaymentBasic = ({
  className,
  typedData,
  chainId,
}: CardPaymentBasic) => {
  const data = React.useMemo(() => {
    const formattedTerms = decodeEnforcerERC20TransferAmount(
      typedData.caveats[0].terms,
    );

    const token = findToken(chainId, formattedTerms[0] as Address);
    if (!token) {
      // TODO: handle unknown token by fetching token data
      return {
        to: typedData.delegate,
        token: formattedTerms[0] as Address,
        amount: formattedTerms[1],
        name: 'Unknown',
        symbol: 'UNK',
        decimals: 18,
      };
    }
    return {
      to: typedData.delegate,
      token: formattedTerms[0] as Address,
      amount: formattedTerms[1],
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    };
  }, [typedData]);

  return (
    <div className={cn(className)}>
      <div className="pb-6">
        <DebitCard
          color="green"
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
        <RowBasic label="Expiration" value={'Never'} />
      </div>
    </div>
  );
};

export { CardPaymentBasic };
