'use client';
import { useState } from 'react';
import { ROOT_AUTHORITY, SALT, universalDeployments } from 'universal-data';
import type { Delegation, DelegationWithMetadata } from 'universal-types';
import {
  type Address,
  parseUnits,
  // ,
  // parseUnits
} from 'viem';
import { useSignTypedData } from 'wagmi';
import { useInsertDelegation } from '../api/actions/insert-delegation.js';
import { eip712DelegationTypes } from '../delegation/eip712-delegation-type.js';
import { getDelegationHash } from '../delegation/get-delegation-hash.js';
import { encodeEnforcerERC20TransferAmount } from '../enforcers/enforcer-erc20-transfer-amount.js';
import { encodeERC20BalanceGteWrapEnforcerTerms } from '../enforcers/erc20-balance-gte-wrap-enforcer.js';
// import { encodeERC20BalanceGteWrapEnforcerTerms } from '../enforcers/erc20-balance-gte-wrap-enforcer.js';

type SignDelegationParams = {
  chainId: number;
  delegator: Address;
  delegate: Address;
  salt?: bigint;
  tokenOut: Address;
  decimalsOut: number;
  amountOut: string;
  tokenIn: Address;
  decimalsIn: number;
  amountIn: string;
};

export function useSignErc20SwapDelegation() {
  const { data, signTypedData, signTypedDataAsync, ...rest } =
    useSignTypedData();
  const { mutate, ...insertRest } = useInsertDelegation();
  const [delegation, setDelegation] = useState<DelegationWithMetadata | null>();

  async function signAndSaveDelegationAsync({
    chainId,
    delegator,
    delegate,
    salt = SALT,
    tokenOut,
    decimalsOut,
    amountOut,
    tokenIn,
    decimalsIn,
    amountIn,
  }: SignDelegationParams) {
    const signature = await signTypedDataAsync({
      types: eip712DelegationTypes,
      primaryType: 'Delegation',
      domain: {
        name: 'DelegationManager',
        version: '1',
        chainId: chainId,
        verifyingContract: universalDeployments.DelegationManager,
      },
      message: {
        delegate: delegate,
        delegator: delegator,
        authority: ROOT_AUTHORITY,
        salt: salt,
        caveats: [
          {
            enforcer: universalDeployments.ERC20BalanceGteWrapEnforcer,
            terms: encodeERC20BalanceGteWrapEnforcerTerms({
              token: tokenIn,
              amount: parseUnits(amountIn, decimalsIn),
            }),
          },
          {
            enforcer: universalDeployments.ERC20TransferAmountEnforcer,
            terms: encodeEnforcerERC20TransferAmount({
              token: tokenOut,
              amount: amountOut,
              decimals: decimalsOut,
            }),
          },
          {
            enforcer: universalDeployments.ExternalCallEnforcer,
            terms: '0x',
          },
        ],
      },
    });

    const _coreDelegation: Delegation = {
      authority: ROOT_AUTHORITY,
      delegate: delegate,
      delegator: delegator,
      salt,
      signature,
      caveats: [
        {
          enforcer: universalDeployments.ERC20BalanceGteWrapEnforcer,
          terms: encodeERC20BalanceGteWrapEnforcerTerms({
            token: tokenIn,
            amount: parseUnits(amountIn, decimalsIn),
          }),
          args: '0x',
        },
        {
          enforcer: universalDeployments.ERC20TransferAmountEnforcer,
          terms: encodeEnforcerERC20TransferAmount({
            token: tokenOut,
            amount: amountOut,
            decimals: decimalsOut,
          }),
          args: '0x',
        },
        {
          enforcer: universalDeployments.ExternalCallEnforcer,
          terms: '0x',
          args: '0x',
        },
      ],
    };

    const _delegation = {
      hash: getDelegationHash(_coreDelegation),
      chainId: chainId,
      type: 'DebitAuthorization',
      verifyingContract: universalDeployments.DelegationManager,
      authorityDelegation: null,
      ..._coreDelegation,
      caveats: _coreDelegation.caveats.map((caveat) => ({
        ...caveat,
        type: 'ERC20TransferAmount',
      })),
    } satisfies DelegationWithMetadata;

    setDelegation(_delegation);
    mutate({
      ..._delegation,
      salt: salt.toString(),
    });
  }

  return {
    delegation,
    signAndSaveDelegationAsync,
    data,
    mutation: insertRest,
    ...rest,
  };
}
