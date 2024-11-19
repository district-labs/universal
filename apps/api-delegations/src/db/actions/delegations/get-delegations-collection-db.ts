import { and, sql } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';

export async function getDelegationsCollectionDb({
  address,
  type,
}: { address: Address; type: string }) {
  const lowercasedAddress = address.toLowerCase();

  const delegate = await db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      and(
        eq(sql`LOWER(${delegations.delegate})`, lowercasedAddress),
        eq(delegations.type, type)
      ),
    with: {
      caveats: true,
    },
  });

  const delegator = await db.query.delegations.findMany({
    where: (delegations, { eq }) =>
      and(
        eq(sql`LOWER(${delegations.delegator})`, lowercasedAddress),
        eq(delegations.type, type)
      ),
    with: {
      caveats: true,
    },
  });

  return {
    delegate,
    delegator,
  };
}
