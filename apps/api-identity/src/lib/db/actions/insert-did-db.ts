import { db } from "../index.js";
import { type InsertDidDb, dids as didsDb } from "../schema.js";

export function insertDidDb(params: InsertDidDb) {
	return db
		.insert(didsDb)
		.values(params)
		.onConflictDoUpdate({
			target: didsDb.address,
			set: {
				document: params.document,
				signature: params.signature,
				identifier: params.identifier,
				resolver: params.resolver,
			},
		});
}
