import { and } from "drizzle-orm";
import { db } from "../../index.js";

export function getLeaderboardAccounts({ limit }: { limit?: number } = {}) {
	return db.query.accountsDb.findMany({
		limit: limit || 25,
		where: (accounts, { eq }) => and(eq(accounts.isActive, true)),
	});
}
