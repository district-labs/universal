import { db } from "@/db/index.js";
import { delegations as delegationsDb } from "@/db/schema.js";
import { eq } from "drizzle-orm";

export function invalidateDelegationDb({ hash }: { hash: string }) {
  return db
    .update(delegationsDb)
    .set({ isValid: false })
    .where(eq(delegationsDb.hash, hash))
    .returning();
}
