'use client';

import { useReadContract } from 'wagmi';
import { delegationManagerAbi } from 'universal-data';
import { getDelegationHash } from '../../delegation/get-delegation-hash.js';

import type { DelegationWithMetadata } from 'universal-types';

export function useDelegationStatus({
  delegation,
}: {
  delegation: DelegationWithMetadata;
}) {
  const hash = getDelegationHash(delegation);
  return useReadContract({
    abi: delegationManagerAbi,
    address: delegation.verifyingContract,
    functionName: 'disabledDelegations',
    args: [hash],
    query: {
      enabled: !!delegation && !!hash,
      refetchInterval: 3000,
    },
  });
}
