'use client';
import type { DelegationDb } from 'api-delegations';
import type { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { delegationManagerAbi } from '../../abis/delegation-manager-abi.js';
import type { Delegation } from '../../types.js';

export function useDisableDelegation({
  delegationManager,
  delegation,
}: {
  delegationManager: Address;
  delegation: Delegation | DelegationDb;
}) {
  const { writeContract, ...rest } = useWriteContract();

  const disable = () => {
    if (!delegationManager || !delegation) return;
    writeContract({
      abi: delegationManagerAbi,
      address: delegationManager,
      functionName: 'disableDelegation',
      args: [delegation as Delegation],
    });
  };

  return { disable, ...rest };
}
