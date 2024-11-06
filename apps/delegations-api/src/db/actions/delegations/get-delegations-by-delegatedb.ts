import { db } from "../../index.js";

export function getDelegationsByDelegateDb({ delegate }: { delegate: string }) {
  return db.query.delegations.findMany({
    where: (delegations, { eq }) => eq(delegations.delegate, delegate),
    with: {
      caveats: true,
    },
  });
}
