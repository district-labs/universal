import { db } from '../../index.js';
import { type InsertAccountDb, accountsDb } from '../../schema.js';

export function insertAccountDb(data: InsertAccountDb) {
  return db.transaction(async (tx) => {
    await tx.insert(accountsDb).values(data).returning();
  });
}
