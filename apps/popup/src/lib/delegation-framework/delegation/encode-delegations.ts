import { type Hex, encodeAbiParameters } from 'viem';

import type { Delegation } from '../types';

export function encodeDelegations(delegations: Delegation[]): Hex {
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
    [delegations],
  );
}
