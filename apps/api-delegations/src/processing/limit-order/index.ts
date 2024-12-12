import type { Delegation, DelegationExecution } from 'universal-types';
import {
  decodeEnforcerERC20TransferAmount,
  encodeDelegation,
  encodeExternalCallEnforcerArgs,
  encodeSingleExecution,
  getErc20TransferAmountEnforcerFromDelegation,
  getExternalHookEnforcerFromDelegation,
} from './utils.js';
import { getResolverWalletClient } from '../../resolver/resolver-wallet-client.js';
import type { ValidChain } from 'universal-data';
import {
  SINGLE_EXECUTION_MODE,
  aaveV3PoolAbi,
  delegationManagerAbi,
  universalDeployments,
} from 'universal-data';
import { encodeFunctionData, type Address, type Hex, erc20Abi } from 'viem';
import { multicallAbi } from 'universal-data';

const AAVE_V3_POOL_BASE = '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5';

function getDepositAaveV3HookData({
  amount,
  delegator,
  token,
}: { amount: bigint; delegator: Address; token: Address }): Hex {
  return encodeFunctionData({
    abi: multicallAbi,
    functionName: 'multicall',
    args: [
      [
        // Approves the token to the Aave Pool
        {
          target: token,
          value: 0n,
          callData: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [AAVE_V3_POOL_BASE, amount],
          }),
        },
        // Deposits the token to the Aave Pool on behalf of the delegator
        {
          target: AAVE_V3_POOL_BASE,
          value: 0n,
          callData: encodeFunctionData({
            abi: aaveV3PoolAbi,
            functionName: 'supply',
            args: [token, amount, delegator, 0],
          }),
        },
      ],
    ],
  });
}

export async function processLimitOrderDelegation({
  chainId,
  delegation,
}: { chainId: ValidChain['id']; delegation: Delegation }) {
  const { erc20TransferAmountEnforcer } =
    getErc20TransferAmountEnforcerFromDelegation(delegation);
  const { token, amount } = decodeEnforcerERC20TransferAmount(
    erc20TransferAmountEnforcer.terms,
  );

  const { externalHookEnforcer, index: externalHookEnforcerIndex } =
    getExternalHookEnforcerFromDelegation(delegation);

  delegation.caveats[externalHookEnforcerIndex] = {
    ...externalHookEnforcer,
    // Update the args of the external hook enforcer to include the data for the Aave V3 deposit
    args: encodeExternalCallEnforcerArgs({
      target: universalDeployments.Multicall,
      callData: getDepositAaveV3HookData({
        amount,
        token,
        delegator: delegation.delegator,
      }),
    }),
  };

  // Get resolver wallet client
  const resolverWalletClient = getResolverWalletClient(chainId);

  // Set the delegation execution to transfer the delegator tokens to the multicall contract
  const execution: DelegationExecution = {
    value: 0n,
    target: token,
    calldata: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [universalDeployments.Multicall, amount],
    }),
  };

  const permissionContexts = [encodeDelegation(delegation)];
  const executionCallData = [encodeSingleExecution(execution)];
  const executionModes = SINGLE_EXECUTION_MODE;

  // Redeem the delegation
  const txHash = await resolverWalletClient.writeContract({
    address: universalDeployments.DelegationManager,
    abi: delegationManagerAbi,
    functionName: 'redeemDelegations',
    args: [permissionContexts, executionModes, executionCallData],
  });

  return txHash;
}
