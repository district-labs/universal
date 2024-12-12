import { db } from '../../index.js';
import {
  caveats as caveatsDb,
  delegations as delegationsDb,
  type InsertDelegationDb,
  type InsertCaveatDb,
} from '../../schema.js';

type InsertDelegationDbParams = InsertDelegationDb & {
  caveats: InsertCaveatDb[];
};

export function insertDelegationDb({
  caveats,
  ...delegation
}: InsertDelegationDbParams) {
  return db.transaction(async (tx) => {
    // Insert the delegation
    await tx
      .insert(delegationsDb)
      .values(delegation)
      .returning()
      .onConflictDoNothing();

    if (caveats.length > 0) {
      const caveatsWithDelegationHash = caveats.map((caveat) => ({
        ...caveat,
        delegationHash: delegation.hash,
      }));

      // Insert the caveats
      await tx
        .insert(caveatsDb)
        .values(caveatsWithDelegationHash)
        .returning()
        .onConflictDoNothing();
    }
  });
}
