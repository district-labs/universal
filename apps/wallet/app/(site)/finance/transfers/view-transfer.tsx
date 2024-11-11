'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Address, parseUnits, } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
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
import { useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useWriteContracts } from 'wagmi/experimental';

const formSchema = z.object({
  to: addressSchema,
  token: addressSchema,
  name: z.string(),
  symbol: z.string(),
  decimals: coercedNumberSchema.min(1),
  amount: coercedNumberSchema.min(1),
});

function ViewTransfer() {
  const { writeContract } = useWriteContract();
  const { data: writeContractsData, writeContracts } = useWriteContracts();
  const { address } = useAccount();
  const chainId = useChainId();
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
          address: data.token,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits(data.amount.toString(), data.decimals),
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
          address: data.token,
          functionName: 'transfer',
          args: [
            data.to as Address,
            parseUnits(data.amount.toString(), data.decimals),
          ],
        },
      ],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Account receiving the transfer.</FormDescription>
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
              <FormDescription>Asset you want to transfer.</FormDescription>
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
                Amount of the asset you want to transfer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-4 border-neutral-200' />
        {address && (
          <div className="">
            <Button className="w-full" type="submit" size={'lg'}>
              Send
            </Button>
            <p className='mt-2 text-center text-sm'>
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

export { ViewTransfer };
