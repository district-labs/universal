import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';
import { sqlLower } from '../../utils.js';

export async function getDelegationsCollectionDb({
  address,
  chainId,
  type,
}: { address: Address; chainId: number; type: string }) {
  const lowercasedAddress = address.toLowerCase();

  const [delegate, delegator] = await db.transaction(async (tx) =>
    Promise.all([
      tx.query.delegations.findMany({
        where: (delegations, { eq }) =>
          and(
            eq(sqlLower(delegations.delegate), lowercasedAddress),
            eq(delegations.type, type),
            eq(delegations.chainId, chainId),
          ),
        with: {
          caveats: true,
        },
      }),
      tx.query.delegations.findMany({
        where: (delegations, { eq }) =>
          and(
            eq(sqlLower(delegations.delegator), lowercasedAddress),
            eq(delegations.type, type),
            eq(delegations.chainId, chainId),
          ),
        with: {
          caveats: true,
        },
      }),
    ]),
  );

  return {
    delegate,
    delegator,
  };
}
