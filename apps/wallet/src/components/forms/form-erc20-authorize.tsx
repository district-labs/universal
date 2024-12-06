'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { addressSchema } from '@/lib/validation/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { z } from 'zod';

import { AccountSelectAndInput } from '@/components/fields/account-select-and-input';
import { Erc20SelectAndAmount } from '@/components/fields/erc20-select-and-amount';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { ConnectedWalletName } from '@/components/onchain/connected-wallet-name';
import { DisconnectWalletElement } from '@/components/onchain/disconnect-wallet-element';
import { IsNotUniversalWallet } from '@/components/onchain/is-not-universal-wallet';
import { IsUniversalWallet } from '@/components/onchain/is-universal-wallet';
import { Card } from '@/components/ui/card';
import { defaultTokenList, useIsValidChain } from '@/lib/chains';
import { useToast } from '@/lib/hooks/use-toast';
import { useEffect } from 'react';
import { findToken, getDefaultTokenList } from 'universal-data';
import type { TokenItem } from 'universal-types';
import { useSignErc20TransferDelegation } from 'universal-delegations-sdk';

const formSchema = z.object({
  to: addressSchema,
  token: z.custom<TokenItem>().refine((value) => !!value?.address, {
    message: 'Token is required',
  }),
  amount: z.string().min(1),
});

export type FormSchema = z.infer<typeof formSchema>;
export type FormData = {
  to?: Address;
  token?: TokenItem;
  amount?: string;
};

type FormErc20AuthorizeProps = {
  defaultValues?: FormData;
  onFormChange?: (data?: FormData) => void;
  tokenAddress?: Address;
};

function FormErc20Authorize({
  tokenAddress,
  defaultValues,
  onFormChange,
}: FormErc20AuthorizeProps) {
  const { address } = useAccount();
  const switchChainMutation = useSwitchChain();
  const { signAndSaveDelegationAsync, isSuccess } =
    useSignErc20TransferDelegation();
  const { isValidChain, chainId, defaultChain } = useIsValidChain();
  const tokenList = getDefaultTokenList({
    chainId,
  });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: tokenAddress
        ? findToken({ address: tokenAddress, tokenList })
        : defaultValues?.token
          ? defaultValues.token
          : undefined,
      to: defaultValues?.to || undefined,
      amount: defaultValues?.amount || undefined,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        to: undefined,
        token: undefined,
        amount: undefined,
      });
      toast({
        title: 'Authorization Signed',
        description: 'The authorization has been signed and saved.',
      });
    }
  }, [toast, form, isSuccess]);

  useEffect(() => {
    const subscription = form.watch((data) => {
      onFormChange?.({
        to: data.to as Address,
        token: data.token as TokenItem,
        amount: data.amount,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isValidChain) {
      switchChainMutation.switchChain({
        chainId: defaultChain.id,
      });
    }
    await signAndSaveDelegationAsync({
      chainId: chainId,
      delegate: data.to as Address,
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
          <AccountSelectAndInput />
        </Card>
        <Card className="rounded-3xl p-5">
          <Erc20SelectAndAmount tokenList={defaultTokenList} />
        </Card>
        <div className="mt-4">
          {address && (
            <div className="">
              <IsUniversalWallet>
                {isValidChain ? (
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
                ) : (
                  <Button
                    className="w-full py-3 text-lg"
                    type="submit"
                    disabled={switchChainMutation.isPending}
                    rounded={'full'}
                    variant={'emerald'}
                    size={'lg'}
                  >
                    Switch Chains
                  </Button>
                )}
              </IsUniversalWallet>
              <IsNotUniversalWallet>
                <Button
                  className="w-full py-3 text-lg"
                  type="submit"
                  rounded={'full'}
                  variant={'default'}
                  size={'lg'}
                >
                  Requires Universal Wallet
                </Button>
                <p className="mt-4 text-center text-sm">
                  You're connected with{' '}
                  <ConnectedWalletName className="font-bold" />
                  <br /> Connect a{' '}
                  <span className="font-bold">Universal Wallet</span> to
                  authorize credit lines.
                </p>
                <p className="mt-2 text-center underline">
                  <DisconnectWalletElement>
                    Disconnect Wallet
                  </DisconnectWalletElement>
                </p>
              </IsNotUniversalWallet>
            </div>
          )}

          {!address && (
            <ConnectUniversalWalletButton className="w-full rounded-full py-3 text-lg">
              Connect Universal Wallet
            </ConnectUniversalWalletButton>
          )}
        </div>
      </form>
    </Form>
  );
}

export { FormErc20Authorize };
