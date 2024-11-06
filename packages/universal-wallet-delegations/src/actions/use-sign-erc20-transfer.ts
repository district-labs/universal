'use client';
import { useEffect, useState } from 'react';
import { type Address, type Hex } from 'viem';
import { useChainId, useSignTypedData } from 'wagmi';
import { eip712DelegationTypes } from '../delegation/eip712-delegation-type.js';
import { ROOT_AUTHORITY, SALT } from '../constants.js';
import { delegationFrameworkDeployments } from '../deployments.js';
import { useInsertDelegation } from '../api/actions/insert-delegation.js';
import { encodeEnforcerERC20TransferAmount } from '../enforcers/enforcer-erc20-transfer-amount.js';
import { getDelegationHash } from '../delegation/get-delegation-hash.js';

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
  const {
    data,
    signTypedData,
    signTypedDataAsync,
    ...rest
  } = useSignTypedData();
  const chainId = useChainId();
  const { mutate, ...insertRest } = useInsertDelegation();
  const [ delegation, setDelegation ] = useState<any>()

  function signAndSaveDelegation({
        chainId,
        delegator,
        delegate,
        salt = SALT,
        erc20,
        decimals = 18,
        amount = '0',
    }: SignDelegationParams) {
        if(!delegationFrameworkDeployments[chainId]) return;
        setDelegation({
            chainId: chainId,
            delegate: delegate,
            delegator: delegator,
            authority: ROOT_AUTHORITY,
            salt: Number(salt),
            caveats: [
            {   
                enforcerType: 'ERC20TransferAmount',
                enforcer: delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount as Address,
                terms: encodeEnforcerERC20TransferAmount({
                    token: erc20,
                    amount: amount,
                    decimals: decimals
                }),
                args: "0x"
            }]
        });

        signTypedData({
        types: eip712DelegationTypes,
        primaryType: 'Delegation',
        domain: {
            name: 'DelegationManager',
            version: '1',
            chainId: chainId,
            verifyingContract: delegationFrameworkDeployments[chainId].delegationManager,
        },
        message: {
            delegate: delegate,
            delegator: delegator,
            authority: ROOT_AUTHORITY,
            salt: salt,
            caveats: [
            {
                enforcer: delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount as Address,
                terms: encodeEnforcerERC20TransferAmount({
                    token: erc20,
                    amount: amount,
                    decimals: decimals
                }),
            }]
        },
    });
  }

  useEffect( () => { 
    if(data && delegation) {
        const _delegation = { 
            ...delegation,
            chainId: chainId,
            signature: data,
        };
        const __delegation = {
            ..._delegation,
            hash: getDelegationHash(_delegation),
        }

        mutate(__delegation);
    }
  }, [data, delegation])

  async function signAndSaveDelegationAsync({
    chainId,
    delegator,
    delegate,
    salt = SALT,
    erc20,
    decimals = 18,
    amount = '0',
}: SignDelegationParams) {
    if(!delegationFrameworkDeployments[chainId]) return;
    const signature = await signTypedDataAsync({
        types: eip712DelegationTypes,
        primaryType: 'Delegation',
        domain: {
            name: 'DelegationManager',
            version: '1',
            chainId: chainId,
            verifyingContract: delegationFrameworkDeployments[chainId].delegationManager,
        },
        message: {
            delegate: delegate,
            delegator: delegator,
            authority: ROOT_AUTHORITY,
            salt: salt,
            caveats: [
            {
                enforcer: delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount as Address,
                terms: encodeEnforcerERC20TransferAmount({
                    token: erc20,
                    amount: amount,
                    decimals: decimals
                }),
            }
        ]
        },
    });
    const _delegation = {
        signature: signature as Hex,
        chainId: chainId,
        delegate: delegate as Address,
        delegator: delegator as Address,
        authority: ROOT_AUTHORITY as Hex,
        salt: Number(salt),
        caveats: [
        {
            enforcerType: 'ERC20TransferAmount',
            enforcer: delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount as Address,
            terms: encodeEnforcerERC20TransferAmount({
                token: erc20,
                amount: amount,
                decimals: decimals
            }),
            args: "0x" as Hex
        }
    ]
    }

    setDelegation(_delegation);
    mutate({
        ..._delegation,
        verifyingContract: delegationFrameworkDeployments[chainId].delegationManager as Address,
        type: 'DebitAuthorization',
        hash: getDelegationHash({
            ..._delegation,
            salt: BigInt(salt)
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
