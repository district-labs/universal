import { db } from "../../index.js";

export function getDelegationsByDelegatorDb({ delegator }: { delegator: string }) {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => eq(delegations.delegator, delegator),
    with: {
      caveats: true,
    },
  });
}
