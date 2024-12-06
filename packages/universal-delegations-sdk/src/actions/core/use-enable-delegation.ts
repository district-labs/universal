'use client';

import { useWriteContract } from 'wagmi';
import { delegationManagerAbi } from 'universal-data';

import type { DelegationWithMetadata } from 'universal-types';

export function useEnableDelegation({
  delegation,
}: {
  delegation: DelegationWithMetadata;
}) {
  const { writeContract, ...rest } = useWriteContract();

  const { authority, caveats, delegate, delegator, salt, signature } =
    delegation;

  const enable = () => {
    if (!delegation) return;
    writeContract({
      abi: delegationManagerAbi,
      address: delegation.verifyingContract,
      functionName: 'enableDelegation',
      args: [
        {
          authority,
          delegate,
          delegator,
          salt,
          signature,
          caveats: caveats.map(({ enforcer, terms, args }) => ({
            enforcer,
            terms,
            args,
          })),
        },
      ],
    });
  };

  return { enable, ...rest };
}
