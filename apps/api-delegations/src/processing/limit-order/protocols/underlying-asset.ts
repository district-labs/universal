import { encodeFunctionData, erc20Abi, type Address, type Hex } from 'viem';

type GetDepositUnderlyingAssetHookDataReturnType = {
  target: Address;
  value: bigint;
  callData: Hex;
}[];

export function getDepositUnderlyingAssetHookData({
  amountOut,
  delegator,
  tokenIn,
}: {
  amountOut: bigint;
  delegator: Address;
  tokenIn: Address;
}): GetDepositUnderlyingAssetHookDataReturnType {
  return [
    // Approves the token to the Aave Pool
    {
      target: tokenIn,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [delegator, amountOut],
      }),
    },
  ];
}
