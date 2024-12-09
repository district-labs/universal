'use client';
import { useEffect, useState } from 'react';
import { universalDeployments, ROOT_AUTHORITY, SALT } from 'universal-data';
import type { Address } from 'viem';
import { useChainId, useSignTypedData } from 'wagmi';
import { useInsertDelegation } from '../api/actions/insert-delegation.js';
import { eip712DelegationTypes } from '../delegation/eip712-delegation-type.js';
import { getDelegationHash } from '../delegation/get-delegation-hash.js';
import { encodeEnforcerERC20TransferAmount } from '../enforcers/enforcer-erc20-transfer-amount.js';
import type { Delegation, DelegationWithMetadata } from 'universal-types';

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
  const [delegation, setDelegation] = useState<DelegationWithMetadata | null>();

  function signAndSaveDelegation({
    chainId,
    delegator,
    delegate,
    salt = SALT,
    erc20,
    decimals = 18,
    amount = '0',
  }: SignDelegationParams) {
    const coreDelegation: Delegation = {
      authority: ROOT_AUTHORITY,
      delegate: delegate,
      delegator: delegator,
      salt,
      signature: '0x',
      caveats: [
        {
          enforcer: universalDeployments.ERC20TransferAmountEnforcer,
          terms: encodeEnforcerERC20TransferAmount({
            token: erc20,
            amount: amount,
            decimals: decimals,
          }),
          args: '0x',
        },
      ],
    };
    setDelegation({
      hash: getDelegationHash(coreDelegation),
      chainId: chainId,
      type: 'DebitAuthorization',
      verifyingContract: universalDeployments.DelegationManager,
      authorityDelegation: null,
      ...coreDelegation,
      caveats: coreDelegation.caveats.map((caveat) => ({
        ...caveat,
        type: 'ERC20TransferAmount',
      })),
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

    const _coreDelegation: Delegation = {
      authority: ROOT_AUTHORITY,
      delegate: delegate,
      delegator: delegator,
      salt,
      signature,
      caveats: [
        {
          enforcer: universalDeployments.ERC20TransferAmountEnforcer,
          terms: encodeEnforcerERC20TransferAmount({
            token: erc20,
            amount: amount,
            decimals: decimals,
          }),
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
    signAndSaveDelegation,
    signAndSaveDelegationAsync,
    data,
    mutation: insertRest,
    ...rest,
  };
}
