'use client';
import { Erc20SelectAndAmount } from '@/components/fields/erc20-select-and-amount';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { defaultTokenList, useIsValidChain } from '@/lib/chains';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ANY_DELEGATE, findToken, getDefaultTokenList } from 'universal-data';
import { useSignErc20SwapDelegation } from 'universal-delegations-sdk';
import type { TokenItem } from 'universal-types';
import type { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { z } from 'zod';

const formSchema = z.object({
  tokenOut: z.custom<TokenItem>().refine((value) => !!value?.address, {
    message: 'Token is required',
  }),
  amountOut: z.string(),
  tokenIn: z.custom<TokenItem>().refine((value) => !!value?.address, {
    message: 'Token is required',
  }),
  amountIn: z.string(),
});

export type FormData = {
  tokenOut?: Address;
  amountOut?: string;
  tokenIn?: Address;
  amountIn?: string;
};

type FormErc20SwapProps = {
  defaultValues?: FormData;
};

function FormErc20Swap({ defaultValues }: FormErc20SwapProps) {
  const { address } = useAccount();
  const { switchChain, isPending: isPendingSwitchChain } = useSwitchChain();
  const { signAndSaveDelegationAsync, isSuccess } =
    useSignErc20SwapDelegation();
  const { writeContracts } = useWriteContracts();

  const { isValidChain, chainId, defaultChain } = useIsValidChain();

  const tokenList = getDefaultTokenList({ chainId });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenOut: defaultValues?.tokenOut
        ? findToken({ address: defaultValues?.tokenOut, tokenList })
        : undefined,
      amountOut: defaultValues?.amountOut || undefined,
      tokenIn: defaultValues?.tokenIn
        ? findToken({ address: defaultValues?.tokenIn, tokenList })
        : undefined,
      amountIn: defaultValues?.amountIn || undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isValidChain) {
      switchChain({
        chainId: defaultChain.id,
      });
      return;
    }
    await signAndSaveDelegationAsync({
      chainId: chainId,
      delegate: ANY_DELEGATE,
      delegator: address as Address,
      tokenOut: data.tokenOut.address as Address,
      decimalsOut: data.tokenOut.decimals,
      amountOut: data?.amountOut?.toString(),
      tokenIn: data.tokenIn.address as Address,
      decimalsIn: data.tokenIn.decimals,
      amountIn: data?.amountIn?.toString(),
    });
    form.reset({
      tokenIn: undefined,
      amountIn: undefined,
      tokenOut: undefined,
      amountOut: undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <Card className="rounded-3xl p-5">
          <Erc20SelectAndAmount
            label="Sell"
            amountName="amountOut"
            tokenName="tokenOut"
            tokenList={defaultTokenList}
            setMaxAmount={(value) => form.setValue('amountOut', value)}
          />
        </Card>
        <Card className="rounded-3xl p-5">
          <Erc20SelectAndAmount
            label="Buy"
            amountName="amountIn"
            tokenName="tokenIn"
            tokenList={defaultTokenList}
          />
        </Card>
        {address && isValidChain && (
          <>
            <Button
              disabled={!form.formState.isValid}
              className="w-full py-3 text-lg"
              type="submit"
              rounded={'full'}
              variant={'emerald'}
              size={'lg'}
            >
              Swap
            </Button>
          </>
        )}
        {address && !isValidChain && (
          <Button
            disabled={isPendingSwitchChain}
            className="w-full py-3 text-lg"
            type="submit"
            rounded={'full'}
            variant={'emerald'}
            size={'lg'}
          >
            Switch Chains
          </Button>
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

export { FormErc20Swap };
