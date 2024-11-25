import { type Hex, encodePacked } from 'viem';

import type { Execution } from '../types.js';

// Typescript implementation of: https://github.com/erc7579/erc7579-implementation/blob/main/src/lib/ExecutionLib.sol#L51-L62
export function encodeSingleExecution({
  calldata,
  target,
  value,
}: Execution): Hex {
  return encodePacked(
    ['address', 'uint256', 'bytes'],
    [target, value, calldata],
  );
}
