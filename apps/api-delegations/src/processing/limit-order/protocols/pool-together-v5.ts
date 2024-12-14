import { encodeFunctionData, erc20Abi, type Address, type Hex } from 'viem';
import { poolTogetherV5Abi, universalDeployments } from 'universal-data';

type GetDepositPoolTogetherV5HookDataReturnType = {
  target: Address;
  value: bigint;
  callData: Hex;
}[];

export function getDepositPoolTogetherV5HookData({
  amountOut,
  delegator,
  tokenOut,
  tokenIn,
}: {
  amountOut: bigint;
  delegator: Address;
  tokenIn: Address;
  tokenOut: Address;
}): GetDepositPoolTogetherV5HookDataReturnType {
  return [
    // Approves the token to the Prize vault
    {
      target: tokenOut,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [tokenIn, amountOut],
      }),
    },
    // Deposits the token to the Prize vault on behalf of the delegator
    {
      target: tokenIn,
      value: 0n,
      callData: encodeFunctionData({
        abi: poolTogetherV5Abi,
        functionName: 'deposit',
        args: [amountOut, delegator],
      }),
    },
  ];
}

type GetWithdrawPoolTogetherV5HookDataReturnType =
  GetDepositPoolTogetherV5HookDataReturnType;

export function getWithdrawPoolTogetherV5HookData({
  amountOut,

  tokenOut,
}: {
  amountOut: bigint;

  tokenOut: Address;
}): GetWithdrawPoolTogetherV5HookDataReturnType {
  return [
    // Deposits the token to the Prize vault on behalf of the delegator
    {
      target: tokenOut,
      value: 0n,
      callData: encodeFunctionData({
        abi: poolTogetherV5Abi,
        functionName: 'redeem',
        args: [
          amountOut,
          universalDeployments.Multicall,
          universalDeployments.Multicall,
        ],
      }),
    },
  ];
}
