import type { Address, Hex } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { delegationManagerAbi } from 'universal-data';
import type {
  DelegationExecution,
  DelegationWithMetadata,
} from 'universal-types';

import { encodeBatchExecution } from '../../execution/encode-batch-execution.js';
import { encodeDelegation } from '../encode-delegation.js';

export function useRedeemDelegation(address: Address) {
  const { writeContract, ...writeContractParams } = useWriteContract();
  const waitForTransactionReceiptQuery = useWaitForTransactionReceipt({
    hash: writeContractParams.data,
  });

  function redeemDelegation({
    delegation,
    executions,
    executionModes,
  }: {
    delegation: DelegationWithMetadata;
    executions: DelegationExecution[];
    executionModes: Hex[];
  }) {
    const permissionContexts = [encodeDelegation(delegation)];
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
