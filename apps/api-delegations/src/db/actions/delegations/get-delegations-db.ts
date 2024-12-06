import { type SQL, eq } from 'drizzle-orm';
import type { GetDelegationsParams } from '../../../validation.js';
import { db } from '../../index.js';
import { delegations } from '../../schema.js';
import { sqlLower } from '../../utils.js';
import type { DelegationWithMetadata } from 'universal-types';

export type GetDelegationsDbReturnType = DelegationWithMetadata[] | undefined;

export async function getDelegationsDb({
  chainId,
  delegate,
  delegator,
  type,
}: GetDelegationsParams): Promise<GetDelegationsDbReturnType> {
  const conditions: SQL[] = [];

  // Adds the valid conditions to the conditions array
  conditions.push(eq(delegations.chainId, chainId));
  if (delegate) {
    conditions.push(eq(sqlLower(delegations.delegate), delegate.toLowerCase()));
  }
  if (delegator) {
    conditions.push(
      eq(sqlLower(delegations.delegator), delegator.toLowerCase()),
    );
  }
  if (type) {
    conditions.push(eq(delegations.type, type));
  }
  const delegationsDb = await db.query.delegations.findMany({
    where: (_, { and }) => and(...conditions),
    with: {
      caveats: true,
    },
  });

  // TODO: Support recursive delegation chaining with CTE
  return delegationsDb.map((delegationDb) => ({
    ...delegationDb,
    authorityDelegation: null,
  }));
}
