'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { addressSchema } from '@/lib/validation/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { z } from 'zod';

import { AccountSelectAndInput } from '@/components/fields/account-select-and-input';
import { Erc20SelectAndAmount } from '@/components/fields/erc20-select-and-amount';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { Card } from '@/components/ui/card';
import type { TokenItem } from 'universal-data';
import { tokenList } from 'universal-data';

const formSchema = z.object({
  to: addressSchema,
  token: z.custom<TokenItem>(),
  amount: z.string(),
});

function FormerErc20Transfer() {
  const { address } = useAccount();
  const { writeContracts } = useWriteContracts();
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
    form.reset({
      to: undefined,
      token: undefined,
      amount: undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <Card className="rounded-3xl p-5">
          <AccountSelectAndInput />
        </Card>
        <Card className="rounded-3xl p-5">
          <Erc20SelectAndAmount tokenList={tokenList} />
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
              Transfer
            </Button>
          </div>
        )}

        {!address && (
          <ConnectUniversalWalletButton className="w-full rounded-full py-3 text-lg">
            Connect Universal Wallet
          </ConnectUniversalWalletButton>
        )}
      </form>
    </Form>
  );
}

export { FormerErc20Transfer };
