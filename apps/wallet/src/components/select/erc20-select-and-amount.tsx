import type { Dispatch } from 'react';

import type { TokenItem, TokenList } from 'universal-data';
import { FormDescription, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { TokenSelector } from './erc20-selector';

interface Erc20SelectAndAmount {
  disabled?: boolean;
  valueAmount: string | undefined;
  onAmountChanged: Dispatch<string>;
  valueToken: TokenItem;
  onTokenSelected: (token: TokenItem) => void;
  tokenList: TokenList;
}

export function Erc20SelectAndAmount({
  disabled,
  valueAmount,
  onAmountChanged,
  valueToken,
  onTokenSelected,
  tokenList,
}: Erc20SelectAndAmount) {
  return (
    <div className="group relative w-full">
      <FormLabel className="text-foreground text-lg">Asset</FormLabel>
      <div className="my-1 flex w-full items-center justify-between gap-2">
        <Input
          disabled={disabled}
          id="amount"
          className="block h-auto w-full flex-1 border-transparent bg-transparent py-1 pl-0 text-left font-medium text-5xl shadow-none placeholder:text-muted-foreground focus:border-transparent focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
          placeholder="0.0"
          value={valueAmount}
          onChange={(e) => onAmountChanged(e.target.value)}
        />
        <div className="flex items-center gap-x-2">
          <TokenSelector
            disabled={disabled}
            tokenList={tokenList}
            value={valueToken}
            onValueChange={onTokenSelected}
          />
        </div>
      </div>
      <FormDescription>
        Select the asset and amount you want to transfer.
      </FormDescription>
    </div>
  );
}
