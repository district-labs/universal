import type { Hex } from "viem";
import { db } from "../../index.js";
import type { DelegationDb } from "../../schema.js";

export function getDelegationsByDelegatorDb({
	delegator,
}: { delegator: Hex }): Promise<DelegationDb[]> {
	return db.query.delegations.findMany({
		where: (delegations, { eq }) => eq(delegations.delegator, delegator),
		with: {
			caveats: true,
		},
	});
}
