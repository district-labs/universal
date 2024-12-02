import { universalDeployments } from 'universal-data';
import type { Delegation } from '../types';

export const signDelegationTypes = {
  Caveat: [
    {
      name: 'enforcer',
      type: 'address',
    },
    {
      name: 'terms',
      type: 'bytes',
    },
  ],
  Delegation: [
    {
      name: 'delegate',
      type: 'address',
    },
    {
      name: 'delegator',
      type: 'address',
    },
    {
      name: 'authority',
      type: 'bytes32',
    },
    {
      name: 'caveats',
      type: 'Caveat[]',
    },
    {
      name: 'salt',
      type: 'uint256',
    },
  ],
} as const;

export function getSignDelegationPayload(delegation: Delegation) {
  return {
    types: signDelegationTypes,
    primaryType: 'Delegation',
    domain: {
      name: 'DelegationManager',
      version: '1',
      chainId: 84532,
      verifyingContract: universalDeployments.DelegationManager,
    },
    message: delegation,
  } as const;
}
