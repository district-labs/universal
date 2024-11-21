import { and } from "drizzle-orm";
import type { Address } from "viem";
import { db } from "../../index.js";
import type { DelegationDb } from "../../schema.js";

export function getDelegationsByDelegatorAndTypeDb({
	delegator,
	type,
}: { delegator: Address; type: string }): Promise<DelegationDb[]> {
	return db.query.delegations.findMany({
		where: (delegations, { eq }) =>
			and(eq(delegations.delegator, delegator), eq(delegations.type, type)),
		with: {
			caveats: true,
		},
	});
}
