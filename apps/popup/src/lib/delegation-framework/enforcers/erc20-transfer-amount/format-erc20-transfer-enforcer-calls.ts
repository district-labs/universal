import { universalDeployments } from 'universal-data';
import {
  encodeDelegations,
  type Delegation,
  decodeEnforcerERC20TransferAmount,
  encodeSingleExecution,
  SINGLE_EXECUTION_MODE,
  delegationManagerAbi,
  type Execution,
} from 'universal-delegations-sdk';
import {
  encodeFunctionData,
  type CallParameters,
  type Hex,
  erc20Abi,
} from 'viem';
import { baseSepolia } from 'viem/chains';

export type DelegationWithHash = Delegation & { hash: Hex };
export type DelegationWithAmount = Delegation & { amount: bigint };
export type Erc20TransferEnforcerRedemption = {
  delegation: DelegationWithHash;
  amount: bigint;
};

function encodeErc20TransferEnforcerCalldata(delegation: DelegationWithAmount) {
  const caveat = delegation.caveats[0];

  if (!caveat) {
    throw new Error('No caveat found');
  }

  const [token] = decodeEnforcerERC20TransferAmount(caveat.terms);
  const permissionContexts = [encodeDelegations([delegation])];
  const execution: Execution = {
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
    // TODO: Handle multichain
    to: universalDeployments[baseSepolia.id].DelegationManager,
    data: encodeErc20TransferEnforcerCalldata({
      amount,
      ...delegation,
    }),
  }));

  return callParameters;
}
