import type { Hex } from 'viem';
import { db } from '../../index.js';
import type { DelegationDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsByDelegatorDb({
  delegator,
}: { delegator: Hex }): Promise<DelegationDb[]> {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      eq(sqlLower(delegations.delegator), delegator.toLowerCase()),
    with: {
      caveats: true,
    },
  });
}
