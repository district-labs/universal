import { formatNumber } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import type { TokenItem, TokenList } from 'universal-types';
import { type Address, erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { Badge } from '../ui/badge';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { TokenSelector } from './erc20-selector';

interface Erc20SelectAndAmount {
  tokenList: TokenList;
  label?: string;
  amountName?: string;
  tokenName?: string;
  disabled?: boolean;
  amountDisabled?: boolean;
  tokenSelectorDisabled?: boolean;
  setMaxAmount?: (value: string) => void;
}

export function Erc20SelectAndAmount({
  disabled,
  tokenList,
  label = 'Asset',
  amountName = 'amount',
  tokenName = 'token',
  amountDisabled,
  tokenSelectorDisabled,
  setMaxAmount,
}: Erc20SelectAndAmount) {
  const { control } = useFormContext();

  return (
    <div className="group relative w-full">
      <FormLabel className="text-foreground text-lg">{label}</FormLabel>
      <div className="my-1 flex w-full items-center justify-between gap-2">
        <FormField
          control={control}
          name={amountName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={disabled || amountDisabled}
                  id="amount"
                  className="block h-auto w-full flex-1 border-transparent bg-transparent py-1 pl-0 text-left font-bold text-5xl shadow-none placeholder:text-muted-foreground focus:border-transparent focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
                  placeholder="0.0"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={tokenName}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormControl>
                <TokenSelector
                  disabled={disabled || tokenSelectorDisabled}
                  tokenList={tokenList}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <BalanceAndMaxInput
                className="text-muted-foreground text-xs"
                token={field?.value}
                setMaxAmount={setMaxAmount}
              />
            </FormItem>
          )}
        />
      </div>
      {/* <FormDescription>
        Select the asset and amount you want to transfer.
      </FormDescription> */}
    </div>
  );
}

type BalanceAndMaxInputProps = React.HTMLAttributes<HTMLElement> & {
  token: TokenItem;
  setMaxAmount?: (value: string) => void;
};

const BalanceAndMaxInput = ({
  className,
  token,
  setMaxAmount,
}: BalanceAndMaxInputProps) => {
  const { address: account } = useAccount();
  const { data } = useReadContract({
    abi: erc20Abi,
    address: token?.address as Address,
    functionName: 'balanceOf',
    args: [account as Address],
    query: {
      enabled: !!account && !!token,
      refetchInterval: 5000,
    },
  });

  if (!token) {
    return null;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-end">
        <span className={className}>0.00 {token?.symbol}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-x-1">
      <span className="flex items-center gap-x-1 text-xs">
        <span>{formatNumber(formatUnits(data, token.decimals))}</span>
        <span className="font-semibold">{token?.symbol}</span>
      </span>
      {setMaxAmount && (
        <Badge
          onClick={() => setMaxAmount?.(formatUnits(data, token.decimals))}
          variant={'outline'}
          className="cursor-pointer text-xs transition-shadow hover:shadow-md"
        >
          Max
        </Badge>
      )}
    </div>
  );
};
