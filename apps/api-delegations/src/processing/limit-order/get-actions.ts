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

  if (!tokenInData || !tokenOutData) {
    throw new Error('Token not found');
  }

  // Withdraw actions
  if (tokenOutData.extensions?.protocol === 'aave-v3') {
    withdrawActions = getWithdrawAaveV3HookData({
      amountIn,
      tokenIn,
    });
  } else if (tokenOutData.extensions?.protocol === 'pool-together-v5') {
    withdrawActions = getWithdrawPoolTogetherV5HookData({
      amountOut,
      tokenOut,
    });
  }

  // Deposit actions
  if (tokenInData.extensions?.protocol === 'aave-v3') {
    depositActions = getDepositAaveV3HookData({
      amountIn,
      delegator,
      tokenOut,
    });
  } else if (tokenInData.extensions?.protocol === 'pool-together-v5') {
    depositActions = getDepositPoolTogetherV5HookData({
      amountIn,
      delegator,
      tokenIn,
      tokenOut,
    });
  } else if (!tokenInData.extensions?.protocol) {
    depositActions = getDepositUnderlyingAssetHookData({
      amountIn,
      delegator,
      tokenIn,
    });
  }

  return {
    withdrawActions,
    depositActions,
  };
}
