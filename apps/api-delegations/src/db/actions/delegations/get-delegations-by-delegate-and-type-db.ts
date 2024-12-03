import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegateAndTypeDb({
  chainId,
  delegate,
  type,
}: {
  chainId: number;
  delegate: Address;
  type: string;
}): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      and(
        eq(sqlLower(delegations.delegate), delegate.toLowerCase()),
        eq(delegations.type, type),
        eq(delegations.chainId, chainId),
      ),
    with: {
      caveats: true,
    },
  });
}
