import { eq } from 'drizzle-orm';
import type { Hash } from 'viem';
import { db } from '../../index.js';
import { delegations as delegationsDb } from '../../schema.js';
import { sqlLower } from '../../utils.js';

export function invalidateDelegationDb({ hash }: { hash: Hash }) {
  return db
    .update(delegationsDb)
    .set({ isValid: false })
    .where(eq(sqlLower(delegationsDb.hash), hash.toLowerCase()))
    .returning();
}
