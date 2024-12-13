import type { Delegation, DelegationExecution } from 'universal-types';
import {
  decodeERC20BalanceGteWrapEnforcerTerms,
  decodeEnforcerERC20TransferAmount,
  encodeDelegation,
  encodeExternalCallEnforcerArgs,
  encodeSingleExecution,
  getERC20BalanceGteWrapEnforcerFromDelegation,
  getErc20TransferAmountEnforcerFromDelegation,
  getExternalHookEnforcerFromDelegation,
} from './utils.js';
import { getResolverWalletClient } from '../../resolver/resolver-wallet-client.js';
import type { ValidChain } from 'universal-data';
import {
  SINGLE_EXECUTION_MODE,
  delegationManagerAbi,
  multicallAbi,
  universalDeployments,
} from 'universal-data';
import { encodeFunctionData, erc20Abi } from 'viem';
import { getHookActions } from './get-actions.js';

export async function processLimitOrderDelegation({
  chainId,
  delegation,
}: { chainId: ValidChain['id']; delegation: Delegation }) {
  const { erc20TransferAmountEnforcer } =
    getErc20TransferAmountEnforcerFromDelegation(delegation);
  const { token: tokenOut, amount: amountOut } =
    decodeEnforcerERC20TransferAmount(erc20TransferAmountEnforcer.terms);

  const { erc20BalanceGteWrapEnforcer } =
    getERC20BalanceGteWrapEnforcerFromDelegation(delegation);

  const { token: tokenIn, amount: amountIn } =
    decodeERC20BalanceGteWrapEnforcerTerms(erc20BalanceGteWrapEnforcer.terms);

  const { externalHookEnforcer, index: externalHookEnforcerIndex } =
    getExternalHookEnforcerFromDelegation(delegation);

  const { withdrawActions, depositActions } = getHookActions({
    amountIn,
    amountOut,
    delegator: delegation.delegator,
    tokenIn,
    tokenOut,
  });

  delegation.caveats[externalHookEnforcerIndex] = {
    ...externalHookEnforcer,
    // Update the args of the external hook enforcer to include the data for the Aave V3 deposit
    args: encodeExternalCallEnforcerArgs({
      target: universalDeployments.Multicall,
      callData: encodeFunctionData({
        abi: multicallAbi,
        functionName: 'multicall',
        args: [[...withdrawActions, ...depositActions]],
      }),
    }),
  };

  // Get resolver wallet client
  const resolverWalletClient = getResolverWalletClient(chainId);

  // Set the delegation execution to transfer the delegator tokens to the multicall contract
  const execution: DelegationExecution = {
    value: 0n,
    target: tokenOut,
    calldata: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [universalDeployments.Multicall, amountOut],
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
