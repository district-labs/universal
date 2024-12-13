import { stablecoinTokenList } from 'universal-data';
import type { Address, Hex } from 'viem';
import {
  getDepositAaveV3HookData,
  getWithdrawAaveV3HookData,
} from './protocols/aave-v3.js';
import {
  getDepositPoolTogetherV5HookData,
  getWithdrawPoolTogetherV5HookData,
} from './protocols/pool-together-v5.js';
import { getDepositUnderlyingAssetHookData } from './protocols/underlying-asset.js';
import {
  getDepositCompoundV3HookData,
  getWithdrawCompoundV3HookData,
} from './protocols/compound-v3.js';

type HookActions = {
  target: Address;
  value: bigint;
  callData: Hex;
}[];

type GetHookActionsParams = {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  amountOut: bigint;
  delegator: Address;
};

type GetHookActionsReturnType = {
  withdrawActions: HookActions;
  depositActions: HookActions;
};

export function getHookActions({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  delegator,
}: GetHookActionsParams): GetHookActionsReturnType {
  let withdrawActions: HookActions = [];
  let depositActions: HookActions = [];

  const tokenInData = stablecoinTokenList.tokens.find(
    (token) => token.address.toLowerCase() === tokenIn.toLowerCase(),
  );
  const tokenOutData = stablecoinTokenList.tokens.find(
    (token) => token.address.toLowerCase() === tokenOut.toLowerCase(),
  );
  const underlyingAssetData = stablecoinTokenList.tokens.find(
    (token) => !token.extensions?.protocol,
  );

  if (!tokenInData || !tokenOutData || !underlyingAssetData) {
    throw new Error('Token not found');
  }

  const tokenOutProtocol = tokenOutData.extensions?.protocol;

  // Withdraw actions
  switch (tokenOutProtocol) {
    case 'aave-v3':
      withdrawActions = getWithdrawAaveV3HookData({
        // Always use the underlying asset as the tokenIn for compound
        tokenIn: underlyingAssetData.address as Address,
        amountOut,
      });
      break;
    case 'pool-together-v5':
      withdrawActions = getWithdrawPoolTogetherV5HookData({
        amountOut,
        tokenOut,
      });
      break;
    case 'compound-v3':
      withdrawActions = getWithdrawCompoundV3HookData({
        // Always use the underlying asset as the tokenIn for compound
        tokenIn: underlyingAssetData.address as Address,

        tokenOut,
      });
      break;
  }

  // If there are withdraw calls, the tokenOut should be replaced with the underlying asset
  const updatedTokenOut = withdrawActions.length
    ? (underlyingAssetData.address as Address)
    : tokenOut;

  const tokenInProtocol = tokenInData.extensions?.protocol;
  // Deposit actions
  switch (tokenInProtocol) {
    case 'aave-v3':
      depositActions = getDepositAaveV3HookData({
        amountOut,
        delegator,
        tokenOut: updatedTokenOut,
      });
      break;
    case 'pool-together-v5':
      depositActions = getDepositPoolTogetherV5HookData({
        amountOut,
        delegator,
        tokenIn,
        tokenOut: updatedTokenOut,
      });
      break;
    case 'compound-v3':
      depositActions = getDepositCompoundV3HookData({
        amountOut,
        delegator,
        tokenIn,
        tokenOut: updatedTokenOut,
      });
      break;
    case undefined:
      depositActions = getDepositUnderlyingAssetHookData({
        amountIn,
        delegator,
        tokenIn,
      });
      break;
  }

  return {
    withdrawActions,
    depositActions,
  };
}
