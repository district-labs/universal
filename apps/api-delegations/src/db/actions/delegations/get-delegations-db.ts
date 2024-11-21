import type { Hex } from "viem";
import { db } from "../../index.js";

export function getDelegationsDb({ hash }: { hash: Hex }) {
	return db.query.delegations.findFirst({
		where: (delegations, { eq }) => eq(delegations.hash, hash),
		with: {
			caveats: true,
		},
	});
}
