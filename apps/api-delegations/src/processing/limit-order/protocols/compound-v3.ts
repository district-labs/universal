import {
  encodeFunctionData,
  erc20Abi,
  type Address,
  type Hex,
  maxUint256,
} from 'viem';
import { compoundV3Abi } from 'universal-data';

type GetDepositCompoundV3HookDataReturnType = {
  target: Address;
  value: bigint;
  callData: Hex;
}[];

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
}): GetDepositCompoundV3HookDataReturnType {
  return [
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
  ];
}

type GetWithdrawCompoundV3HookDataReturnType =
  GetDepositCompoundV3HookDataReturnType;
export function getWithdrawCompoundV3HookData({
  tokenOut,
  tokenIn,
}: {
  tokenIn: Address;
  tokenOut: Address;
}): GetWithdrawCompoundV3HookDataReturnType {
  return [
    // Approves the token to the Compound Pool
    {
      target: tokenOut,
      value: 0n,
      callData: encodeFunctionData({
        abi: compoundV3Abi,
        functionName: 'withdraw',
        args: [tokenIn, maxUint256],
      }),
    },
  ];
}
