import { and } from 'drizzle-orm';
import { db } from '../../index.js';

export function getLeaderboardAccounts({ limit }: { limit?: string }) {
  return db.query.accountsDb.findMany({
    limit: Number(limit) || 25,
    where: (accounts, { eq }) => and(eq(accounts.isActive, true)),
  });
}
