import { encodeFunctionData, erc20Abi, type Address, type Hex } from 'viem';
import { aaveV3PoolAbi, universalDeployments } from 'universal-data';

const AAVE_V3_POOL_BASE = '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5';

type GetDepositAaveV3HookDataReturnType = {
  target: Address;
  value: bigint;
  callData: Hex;
}[];

export function getDepositAaveV3HookData({
  amountIn,
  delegator,
  tokenOut,
}: {
  amountIn: bigint;
  delegator: Address;
  tokenOut: Address;
}): GetDepositAaveV3HookDataReturnType {
  return [
    // Approves the token to the Aave Pool
    {
      target: tokenOut,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [AAVE_V3_POOL_BASE, amountIn],
      }),
    },
    // Deposits the token to the Aave Pool on behalf of the delegator
    {
      target: AAVE_V3_POOL_BASE,
      value: 0n,
      callData: encodeFunctionData({
        abi: aaveV3PoolAbi,
        functionName: 'supply',
        args: [tokenOut, amountIn, delegator, 0],
      }),
    },
  ];
}

type GetWithdrawAaveV3HookDataReturnType = GetDepositAaveV3HookDataReturnType;
export function getWithdrawAaveV3HookData({
  amountIn,
  tokenIn,
}: {
  amountIn: bigint;
  tokenIn: Address;
}): GetWithdrawAaveV3HookDataReturnType {
  return [
    // Withdraws the token from the Aave Pool on behalf of the delegator
    {
      target: AAVE_V3_POOL_BASE,
      value: 0n,
      callData: encodeFunctionData({
        abi: aaveV3PoolAbi,
        functionName: 'withdraw',
        args: [tokenIn, amountIn, universalDeployments.Multicall],
      }),
    },
  ];
}
