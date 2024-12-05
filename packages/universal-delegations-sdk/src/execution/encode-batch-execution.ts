import { type Hex, encodeAbiParameters } from 'viem';

import type { DelegationExecution } from 'universal-types';

// Typescript implementation of: https://github.com/erc7579/erc7579-implementation/blob/main/src/lib/ExecutionLib.sol#L33-L39
export function encodeBatchExecution(executions: DelegationExecution[]): Hex {
  return encodeAbiParameters(
    [
      {
        type: 'tuple[]',
        components: [
          {
            type: 'address',
            name: 'target',
          },
          {
            type: 'uint256',
            name: 'value',
          },
          {
            type: 'bytes',
            name: 'calldata',
          },
        ],
      },
    ],
    [executions],
  );
}
