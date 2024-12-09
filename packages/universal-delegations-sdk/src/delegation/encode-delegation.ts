import { type Hex, encodeAbiParameters } from 'viem';

import type { DelegationWithMetadata } from 'universal-types';
import { getDelegationBatch } from './get-delegation-batch.js';

export function encodeDelegation(delegation: DelegationWithMetadata): Hex {
  const delegationBatch = getDelegationBatch(delegation);
  return encodeAbiParameters(
    [
      {
        name: '_delegation',
        type: 'tuple[]',
        internalType: 'struct Delegation',
        components: [
          {
            name: 'delegate',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'delegator',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'authority',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'caveats',
            type: 'tuple[]',
            internalType: 'struct Caveat[]',
            components: [
              {
                name: 'enforcer',
                type: 'address',
                internalType: 'address',
              },
              { name: 'terms', type: 'bytes', internalType: 'bytes' },
              { name: 'args', type: 'bytes', internalType: 'bytes' },
            ],
          },
          { name: 'salt', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    [delegationBatch],
  );
}
