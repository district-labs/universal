'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { addressSchema, coercedNumberSchema } from '@/lib/validation/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectToken } from '@/components/select/select-token';
import { ConnectButton } from '@/components/onchain/connect-button';
import { Card, CardContent } from '@/components/ui/card';
import { DebitCard } from 'universal-wallet-ui';
import { useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useSignErc20TransferDelegation } from 'universal-delegations-sdk';
import { IsUniversalWallet } from '@/components/onchain/is-universal-wallet';
import { IsNotUniversalWallet } from '@/components/onchain/is-not-universal-wallet';

const formSchema = z.object({
  delegate: addressSchema,
  token: addressSchema,
  name: z.string(),
  symbol: z.string(),
  decimals: coercedNumberSchema.min(1),
  amount: coercedNumberSchema.min(1),
});

function ViewCreate() {
  const { signAndSaveDelegationAsync } = useSignErc20TransferDelegation();
  const { address } = useAccount();
  const chainId = useChainId();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const data = form.watch();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    signAndSaveDelegationAsync({
      chainId: chainId,
      delegate: data.delegate,
      delegator: address as Address,
      erc20: data.token,
      decimals: data.decimals,
      amount: data?.amount?.toString(),
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Preview Section */}
      <Card className="bg-neutral-100 border-none shadow-none p-8 order-2 w-full">
        <CardContent className="flex justify-center items-center h-full p-0">
          <DebitCard
            color="green"
            to={data.delegate as Address}
            amount={data?.amount?.toString() || '0'}
            tokenAddress={data.token}
            chainId={chainId}
            name={data.name}
            symbol={data.symbol}
          />
        </CardContent>
      </Card>
      {/* Form Section */}
      <Card className="bg-transparent border-none shadow-none p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="delegate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder={zeroAddress} {...field} />
                  </FormControl>
                  <FormDescription>
                    The address that will be allowed to spend the token.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <SelectToken
                    chainId={chainId}
                    value={field.value}
                    onValueChange={({ address, decimals, name, symbol }) => {
                      field.onChange(address);
                      form.setValue('decimals', decimals);
                      form.setValue('name', name);
                      form.setValue('symbol', symbol);
                    }}
                  />
                  <FormDescription>
                    Asset you want to authorize.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount allowed to be pulled from your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="border-neutral-200 my-4" />
            <IsUniversalWallet>
              {address && (
                <Button className="w-full" type="submit">
                  Authorize Credit Line
                </Button>
              )}
            </IsUniversalWallet>
            <IsNotUniversalWallet>
              <Button className="w-full" type="submit" disabled>
                Connect Universal Wallet
              </Button>
            </IsNotUniversalWallet>

            {!address && (
              <ConnectButton classNameConnect="w-full" className="w-full">
                Connect
              </ConnectButton>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}

export { ViewCreate };
