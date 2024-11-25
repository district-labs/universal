import { db } from '..';
import {
  type InsertInitialOwner,
  initialOwners as initialOwnersDb,
} from '../schema';

export function insertInitialOwnerDb(initialOwner: InsertInitialOwner) {
  return db
    .insert(initialOwnersDb)
    .values(initialOwner)
    .onConflictDoNothing()
    .returning();
}
