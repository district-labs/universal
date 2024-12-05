'use client';

import { useWriteContract } from 'wagmi';
import { delegationManagerAbi } from 'universal-data';
import type { DelegationWithMetadata } from 'universal-types';

export function useDisableDelegation({
  delegation,
}: {
  delegation: DelegationWithMetadata;
}) {
  const { writeContract, ...rest } = useWriteContract();

  const disable = () => {
    if (!delegation) return;

    const { authority, caveats, delegate, delegator, salt, signature } =
      delegation;
    writeContract({
      abi: delegationManagerAbi,
      address: delegation.verifyingContract,
      functionName: 'disableDelegation',
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

  return { disable, ...rest };
}
