import { db } from "../../index.js";
import {
  type InsertDelegationDb,
  type InsertCaveatDb,
  caveats as caveatsDb,
  delegations as delegationsDb,
} from "../../schema.js";

type InsertDelegationDbParams = InsertDelegationDb & {
  caveats: Omit<InsertCaveatDb, "id" | "delegationHash">[];
};

export function insertDelegationDb({
  caveats,
  ...delegation
}: InsertDelegationDbParams) {
  return db.transaction(async (tx) => {
    // Insert the delegation
    await tx.insert(delegationsDb).values(delegation).returning();

    const caveatsWithDelegationHash = caveats.map((caveat) => ({
      ...caveat,
      delegationHash: delegation.hash,
    }));

    // Insert the caveats
    await tx.insert(caveatsDb).values(caveatsWithDelegationHash).returning();
  });
}
