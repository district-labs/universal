import type { Hex } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegatorDb({
  chainId,
  delegator,
}: {
  chainId: number;
  delegator: Hex;
}): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { and, eq }) =>
      and(
        eq(sqlLower(delegations.delegator), delegator.toLowerCase()),
        eq(delegations.chainId, chainId),
      ),
    with: {
      caveats: true,
    },
  });
}
