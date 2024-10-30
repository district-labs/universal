import {
  InsertInitialOwner,
  initialOwners as initialOwnersDb,
} from '../schema';
import { db } from '..';

export function insertInitialOwnerDb(initialOwner: InsertInitialOwner) {
  return db
    .insert(initialOwnersDb)
    .values(initialOwner)
    .onConflictDoNothing()
    .returning();
}
