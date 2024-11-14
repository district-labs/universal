'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Address, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { ConnectButton } from '@/components/onchain/connect-button';
import { IsNotUniversalWallet } from '@/components/onchain/is-not-universal-wallet';
import { IsUniversalWallet } from '@/components/onchain/is-universal-wallet';
import { SelectToken } from '@/components/select/select-token';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { addressSchema, coercedNumberSchema } from '@/lib/validation/utils';
import { useSignErc20TransferDelegation } from 'universal-delegations-sdk';
import { DebitCard } from 'universal-wallet-ui';
import { useChainId } from 'wagmi';

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
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      {/* Preview Section */}
      <Card className="order-2 w-full border-none bg-neutral-100 p-8 shadow-none">
        <CardContent className="flex h-full items-center justify-center p-0">
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
      <Card className="border-none bg-transparent p-4 shadow-none">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
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

            <hr className="my-4 border-neutral-200" />
            <IsUniversalWallet>
              {address && (
                <Button className="w-full" type="submit">
                  Authorize Credit Line
                </Button>
              )}
            </IsUniversalWallet>
            <IsNotUniversalWallet>
              <Button className="w-full" type="submit" disabled={true}>
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
