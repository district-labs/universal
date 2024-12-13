import { encodeFunctionData, erc20Abi, type Address, type Hex } from 'viem';
import { multicallAbi } from 'universal-data';
import { compoundV3Abi } from 'universal-data';

export function getDepositCompoundV3HookData({
  amountOut,
  delegator,
  tokenOut,
  tokenIn,
}: {
  amountOut: bigint;
  delegator: Address;
  tokenIn: Address;
  tokenOut: Address;
}): Hex {
  return encodeFunctionData({
    abi: multicallAbi,
    functionName: 'multicall',
    args: [
      [
        // Approves the token to the Compound Pool
        {
          target: tokenOut,
          value: 0n,
          callData: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [tokenIn, amountOut],
          }),
        },
        // Deposits the token to the Compound Pool on behalf of the delegator
        {
          target: tokenIn,
          value: 0n,
          callData: encodeFunctionData({
            abi: compoundV3Abi,
            functionName: 'supplyTo',
            args: [delegator, tokenOut, amountOut],
          }),
        },
      ],
    ],
  });
}
