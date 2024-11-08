import type { Address } from 'viem';
import { useSignTypedData } from 'wagmi';
import type { Delegation } from '../../types.js';
import { eip712DelegationTypes } from '../eip712-delegation-type.js';

export function useSignDelegation({
  chainId,
  address,
}: {
  chainId: number;
  address: Address;
}) {
  const {
    data: delegationSignature,
    signTypedData,
    ...signTypedDataParams
  } = useSignTypedData();

  function signDelegation(delegation: Delegation) {
    signTypedData({
      types: eip712DelegationTypes,
      primaryType: 'Delegation',
      domain: {
        name: 'DelegationManager',
        version: '1',
        chainId: chainId,
        verifyingContract: address,
      },
      message: delegation,
    });
  }

  return {
    signDelegation,
    delegationSignature,
    ...signTypedDataParams,
  };
}
