'use client';
import { useEffect, useState } from 'react';
import { universalDeployments } from 'universal-data';
import type { Address, Hex } from 'viem';
import { useChainId, useSignTypedData } from 'wagmi';
import { useInsertDelegation } from '../api/actions/insert-delegation.js';
import { ROOT_AUTHORITY, SALT } from '../constants.js';
import { eip712DelegationTypes } from '../delegation/eip712-delegation-type.js';
import { getDelegationHash } from '../delegation/get-delegation-hash.js';
import { encodeEnforcerERC20TransferAmount } from '../enforcers/enforcer-erc20-transfer-amount.js';
import type { Delegation } from '../types.js';

type SignDelegationParams = {
  chainId: number;
  delegator: Address;
  delegate: Address;
  salt?: bigint;
  erc20: Address;
  decimals: number;
  amount: string;
};

export function useSignErc20TransferDelegation() {
  const { data, signTypedData, signTypedDataAsync, ...rest } =
    useSignTypedData();
  const chainId = useChainId();
  const { mutate, ...insertRest } = useInsertDelegation();
  const [delegation, setDelegation] = useState<Delegation | null>();

  function signAndSaveDelegation({
    chainId,
    delegator,
    delegate,
    salt = SALT,
    erc20,
    decimals = 18,
    amount = '0',
  }: SignDelegationParams) {
    setDelegation({
      chainId: chainId,
      delegate: delegate,
      delegator: delegator,
      authority: ROOT_AUTHORITY,
      salt: salt,
      signature: '0x',
      caveats: [
        {
          enforcerType: 'ERC20TransferAmount',
          enforcer: universalDeployments.ERC20TransferAmountEnforcer,
          terms: encodeEnforcerERC20TransferAmount({
            token: erc20,
            amount: amount,
            decimals: decimals,
          }),
          args: '0x',
        },
      ],
    });

    signTypedData({
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
            enforcer: universalDeployments.ERC20TransferAmountEnforcer,
            terms: encodeEnforcerERC20TransferAmount({
              token: erc20,
              amount: amount,
              decimals: decimals,
            }),
          },
        ],
      },
    });
  }

  useEffect(() => {
    if (data && delegation) {
      // @ts-ignore
      mutate({
        ...delegation,
        chainId,
        signature: data,
        // @ts-ignore
        hash: getDelegationHash(delegation),
      });
      return () => {
        setDelegation(null);
      };
    }
    return () => {
      setDelegation(null);
    };
  }, [data, delegation, chainId, mutate]);

  async function signAndSaveDelegationAsync({
    chainId,
    delegator,
    delegate,
    salt = SALT,
    erc20,
    decimals = 18,
    amount = '0',
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
            enforcer: universalDeployments.ERC20TransferAmountEnforcer,
            terms: encodeEnforcerERC20TransferAmount({
              token: erc20,
              amount: amount,
              decimals: decimals,
            }),
          },
        ],
      },
    });
    const _delegation = {
      signature,
      chainId,
      delegate,
      delegator,
      authority: ROOT_AUTHORITY,
      salt: salt,
      caveats: [
        {
          enforcerType: 'ERC20TransferAmount',
          enforcer: universalDeployments.ERC20TransferAmountEnforcer,
          terms: encodeEnforcerERC20TransferAmount({
            token: erc20,
            amount: amount,
            decimals: decimals,
          }),
          args: '0x' as Hex,
        },
      ],
    };

    setDelegation(_delegation);
    mutate({
      ..._delegation,
      verifyingContract: universalDeployments.DelegationManager,
      type: 'DebitAuthorization',
      signature: signature,
      salt: salt.toString(),
      hash: getDelegationHash({
        ..._delegation,
        salt,
      }),
    });
  }

  return {
    delegation,
    signAndSaveDelegation,
    signAndSaveDelegationAsync,
    data,
    mutation: insertRest,
    ...rest,
  };
}
