import { useSignTypedData } from 'wagmi';
import { eip712DelegationTypes } from '../eip712-delegation-type.js';
import type { DelegationWithMetadata } from 'universal-types';

export function useSignDelegation() {
  const {
    data: delegationSignature,
    signTypedData,
    ...signTypedDataParams
  } = useSignTypedData();

  function signDelegation(delegation: DelegationWithMetadata) {
    signTypedData({
      types: eip712DelegationTypes,
      primaryType: 'Delegation',
      domain: {
        name: 'DelegationManager',
        version: '1',
        chainId: delegation.chainId,
        verifyingContract: delegation.verifyingContract,
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
