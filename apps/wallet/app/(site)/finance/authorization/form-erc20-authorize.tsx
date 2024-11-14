'use client';

import { ConnectButton } from '@/components/onchain/connect-button';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { addressSchema } from '@/lib/validation/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { AccountSelectAndInput } from '@/components/select/account-select-and-input';
import { Erc20SelectAndAmount } from '@/components/select/erc20-select-and-amount';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import type { TokenItem } from 'universal-data';
import { tokenList } from 'universal-data';
import { useSignErc20TransferDelegation } from 'universal-delegations-sdk';

const formSchema = z.object({
  to: addressSchema,
  token: z.custom<TokenItem>(),
  amount: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

type FormErc20AuthorizeProps = {
  onFormChange?: (data: FormSchema) => void;
};

function FormErc20Authorize({ onFormChange }: FormErc20AuthorizeProps) {
  const { address, chainId } = useAccount();
  const { signAndSaveDelegationAsync } = useSignErc20TransferDelegation();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const dataWatch = form.watch();
  useEffect(() => {
    console.log(dataWatch, 'dataWatch');
    onFormChange?.({
      ...dataWatch,
      token: dataWatch.token,
    });
  }, [dataWatch.token, onFormChange]);

  useEffect(() => {
    onFormChange?.(dataWatch);
  }, [dataWatch.amount, onFormChange]);

  useEffect(() => {
    onFormChange?.(dataWatch);
  }, [dataWatch.to, onFormChange]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!chainId) {
      return;
    }
    signAndSaveDelegationAsync({
      chainId: chainId,
      delegate: data.to,
      delegator: address as Address,
      erc20: data.token.address as Address,
      decimals: data.token.decimals,
      amount: data?.amount?.toString(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <Card className="rounded-3xl p-5">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <AccountSelectAndInput
                  valueAccount={field.value}
                  onAccountChange={(value) => field.onChange(value)}
                  valueContact={field.value}
                  onContactSelected={(account: string) => {
                    field.onChange(account);
                  }}
                />
              </FormItem>
            )}
          />
        </Card>
        <Card className="rounded-3xl p-5">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <Erc20SelectAndAmount
                  tokenList={tokenList}
                  valueAmount={form.watch('amount')}
                  onAmountChanged={(value) =>
                    form.setValue('amount', value || '')
                  }
                  valueToken={field.value}
                  onTokenSelected={(token: TokenItem) => {
                    field.onChange(token);
                  }}
                />
              </FormItem>
            )}
          />
        </Card>
        {address && (
          <div className="">
            <Button
              disabled={!form.formState.isValid}
              className="w-full py-3 text-lg"
              type="submit"
              rounded={'full'}
              variant={'emerald'}
              size={'lg'}
            >
              Authorize Credit Line
            </Button>
            <p className="mt-2 text-center text-sm">
              The recipient will be able to pull funds from your account.
            </p>
          </div>
        )}

        {!address && (
          <ConnectButton classNameConnect="w-full" className="w-full">
            Connect
          </ConnectButton>
        )}
      </form>
    </Form>
  );
}

export { FormErc20Authorize };
