'use client';
import { useWriteContract } from 'wagmi';
import { delegationManagerAbi, SINGLE_EXECUTION_MODE } from 'universal-data';
import type {
  DelegationWithMetadata,
  DelegationExecution,
} from 'universal-types';

import { encodeDelegation } from '../../delegation/encode-delegation.js';
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
    const permissionContext = [encodeDelegation(delegation)];
    const executionCallData = [encodeSingleExecution(executions)];
    writeContract({
      abi: delegationManagerAbi,
      address: delegation.verifyingContract,
      functionName: 'redeemDelegations',
      args: [permissionContext, SINGLE_EXECUTION_MODE, executionCallData],
    });
  };
}
