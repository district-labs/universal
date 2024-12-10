import {
  universalDeployments,
  delegationManagerAbi,
  SINGLE_EXECUTION_MODE,
} from 'universal-data';
import {
  decodeEnforcerERC20TransferAmount,
  encodeDelegation,
  encodeSingleExecution,
  getErc20TransferAmountEnforcerFromDelegation,
} from 'universal-delegations-sdk';
import type {
  DelegationWithMetadata,
  DelegationExecution,
} from 'universal-types';

import { type CallParameters, encodeFunctionData, erc20Abi } from 'viem';

export type DelegationWithAmount = DelegationWithMetadata & { amount: bigint };
export type Erc20TransferEnforcerRedemption = {
  delegation: DelegationWithMetadata;
  amount: bigint;
};

function encodeErc20TransferEnforcerCalldata(delegation: DelegationWithAmount) {
  const { terms } = getErc20TransferAmountEnforcerFromDelegation(delegation);

  const [token] = decodeEnforcerERC20TransferAmount(terms);
  const permissionContexts = [encodeDelegation(delegation)];
  const execution: DelegationExecution = {
    value: 0n,
    target: token,
    calldata: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [delegation.delegate, delegation.amount],
    }),
  };
  const executionCallData = [encodeSingleExecution(execution)];
  const executionModes = SINGLE_EXECUTION_MODE;

  const calldata = encodeFunctionData({
    abi: delegationManagerAbi,
    functionName: 'redeemDelegations',
    args: [permissionContexts, executionModes, executionCallData],
  });

  return calldata;
}

export function formatErc20TransferEnforcerCalls({
  redemptions,
}: {
  redemptions: Erc20TransferEnforcerRedemption[];
}): CallParameters[] {
  const callParameters = redemptions.map(({ amount, delegation }) => ({
    to: universalDeployments.DelegationManager,
    data: encodeErc20TransferEnforcerCalldata({
      amount,
      ...delegation,
    }),
  }));

  return callParameters;
}
