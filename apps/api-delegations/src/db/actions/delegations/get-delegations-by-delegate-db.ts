import type { Address } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegateDb({
  delegate,
}: { delegate: Address }): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      eq(sqlLower(delegations.delegate), delegate.toLowerCase()),
    with: {
      caveats: true,
    },
  });
}
