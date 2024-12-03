import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegatorAndTypeDb({
  chainId,
  delegator,
  type,
}: {
  chainId: number;
  delegator: Address;
  type: string;
}): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      and(
        eq(sqlLower(delegations.delegator), delegator.toLowerCase()),
        eq(delegations.type, type),
        eq(delegations.chainId, chainId),
      ),
    with: {
      caveats: true,
    },
  });
}
