import type { Address, Hex } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { delegationManagerAbi } from '../../abis/delegation-manager-abi.js';
import type { Delegation, Execution } from '../../types.js';

import { encodeBatchExecution } from '../../execution/encode-batch-execution.js';
import { encodeDelegations } from '../encode-delegations.js';

export function useRedeemDelegation(address: Address) {
  const { writeContract, ...writeContractParams } = useWriteContract();
  const waitForTransactionReceiptQuery = useWaitForTransactionReceipt({
    hash: writeContractParams.data,
  });

  function redeemDelegation({
    delegations,
    executions,
    executionModes,
  }: {
    delegations: Delegation[];
    executions: Execution[];
    executionModes: Hex[];
  }) {
    const permissionContexts = [encodeDelegations(delegations)];
    const executionCallData = [encodeBatchExecution(executions)];

    // TODO: Add prepareWriteContract for better UX
    writeContract({
      address: address,
      abi: delegationManagerAbi,
      functionName: 'redeemDelegations',
      args: [permissionContexts, executionModes, executionCallData],
    });
  }

  return {
    redeemDelegation,
    ...writeContractParams,
    waitForTransactionReceiptQuery,
  };
}
