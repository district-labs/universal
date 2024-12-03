import type { Address } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegateDb({
  chainId,
  delegate,
}: {
  chainId: number;
  delegate: Address;
}): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { and, eq }) =>
      and(
        eq(sqlLower(delegations.delegate), delegate.toLowerCase()),
        eq(delegations.chainId, chainId),
      ),
    with: {
      caveats: true,
    },
  });
}
