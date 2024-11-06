import { and } from "drizzle-orm";
import { db } from "../../index.js";

export function getDelegationsByDelegateAndTypeDb({ delegate, type }: { delegate: string, type: string }) {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => and(
        eq(delegations.delegate, delegate),
        eq(delegations.type, type)
    ),
    with: {
      caveats: true,
    },
  });
}
