'use client';

import { ConnectButton } from '@/components/onchain/connect-button';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { addressSchema } from '@/lib/validation/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { z } from 'zod';

import { AccountSelectAndInput } from '@/components/select/account-select-and-input';
import { Erc20SelectAndAmount } from '@/components/select/erc20-select-and-amount';
import { Card } from '@/components/ui/card';
import type { TokenItem } from 'universal-data';
import { tokenList } from 'universal-data';

const formSchema = z.object({
  to: addressSchema,
  token: z.custom<TokenItem>(),
  amount: z.string(),
});

function FormerErc20Transfer() {
  const { writeContracts } = useWriteContracts();
  const { address } = useAccount();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    writeContracts({
      contracts: [
        {
          abi: [
            {
              type: 'function',
              name: 'mint',
              inputs: [
                { name: 'to', type: 'address', internalType: 'address' },
                { name: 'amount', type: 'uint256', internalType: 'uint256' },
              ],
              outputs: [],
              stateMutability: 'nonpayable',
            },
          ],
          address: data.token.address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits(data.amount.toString(), data.token.decimals),
          ],
        },
        {
          abi: [
            {
              type: 'function',
              name: 'transfer',
              inputs: [
                { name: 'to', type: 'address', internalType: 'address' },
                { name: 'amount', type: 'uint256', internalType: 'uint256' },
              ],
              outputs: [],
              stateMutability: 'nonpayable',
            },
          ],
          address: data.token.address as Address,
          functionName: 'transfer',
          args: [
            data.to as Address,
            parseUnits(data.amount.toString(), data.token.decimals),
          ],
        },
      ],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <Card className="rounded-3xl p-5">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <AccountSelectAndInput
                  valueAccount={form.watch('to')}
                  onAccountChange={(value) => form.setValue('to', value)}
                  valueContact={field.value}
                  onContactSelected={(token: Token) => {
                    field.onChange(token);
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
                  onAmountChanged={(value) => form.setValue('amount', value)}
                  valueToken={field.value}
                  onTokenSelected={(token: TokenItem) => {
                    field.onChange(token);
                  }}
                />
              </FormItem>
            )}
          />
        </Card>
        {/* <hr className="my-4 border-neutral-200" /> */}
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
              Transfer Assets
            </Button>
            <p className="mt-2 text-center text-sm">
              Testnet tokens will be automatically minted during transfer.
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

export { FormerErc20Transfer };
