import { useFormContext } from 'react-hook-form';
import type { TokenList } from 'universal-data';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { TokenSelector } from './erc20-selector';

interface Erc20SelectAndAmount {
  disabled?: boolean;
  tokenList: TokenList;
}

export function Erc20SelectAndAmount({
  disabled,
  tokenList,
}: Erc20SelectAndAmount) {
  const { control } = useFormContext();
  return (
    <>
      <div className="group relative w-full">
        <FormLabel className="text-foreground text-lg">Asset</FormLabel>
        <div className="my-1 flex w-full items-center justify-between gap-2">
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={disabled}
                    id="amount"
                    className="block h-auto w-full flex-1 border-transparent bg-transparent py-1 pl-0 text-left font-medium text-5xl shadow-none placeholder:text-muted-foreground focus:border-transparent focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
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
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TokenSelector
                    disabled={disabled}
                    tokenList={tokenList}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormDescription>
          Select the asset and amount you want to transfer.
        </FormDescription>
      </div>
    </>
  );
}
