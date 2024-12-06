'use client';
import { useWriteContract } from 'wagmi';
import { delegationManagerAbi, SINGLE_EXECUTION_MODE } from 'universal-data';
import type {
  DelegationWithMetadata,
  DelegationExecution,
} from 'universal-types';

import { encodeDelegations } from '../../delegation/encode-delegations.js';
import { encodeSingleExecution } from '../../execution/encode-single-execution.js';

export function useDelegationExecute() {
  const { writeContract } = useWriteContract();

  return ({
    delegation,
    executions,
  }: {
    delegation: DelegationWithMetadata;
    executions: DelegationExecution;
  }) => {
    const permissionContext = [encodeDelegations([delegation])];
    const executionCallData = [encodeSingleExecution(executions)];
    writeContract({
      abi: delegationManagerAbi,
      address: delegation.verifyingContract,
      functionName: 'redeemDelegations',
      args: [permissionContext, SINGLE_EXECUTION_MODE, executionCallData],
    });
  };
}
