import { db } from "../../index.js";
import { type InsertAccountDb, accountsDb } from "../../schema.js";

export function insertAccountDb(data: InsertAccountDb) {
	return db.insert(accountsDb).values(data).returning();
}
