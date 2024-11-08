import { and } from "drizzle-orm";
import { db } from "../../index.js";

export function getDelegationsByDelegatorAndTypeDb({ delegator, type }: { delegator: string, type: string }) {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => and(
        eq(delegations.delegator, delegator),
        eq(delegations.type, type)
    ),
    with: {
      caveats: true,
    },
  });
}
