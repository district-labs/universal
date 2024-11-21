import type { Hash } from 'viem';
import { db } from '../../index.js';
import { delegations as delegationsDb } from '../../schema.js';
import { eq } from 'drizzle-orm';

export function invalidateDelegationDb({ hash }: { hash: Hash }) {
  return db
    .update(delegationsDb)
    .set({ isValid: false })
    .where(eq(delegationsDb.hash, hash))
    .returning();
}
