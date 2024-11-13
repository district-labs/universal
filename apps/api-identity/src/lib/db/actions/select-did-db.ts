import { sql } from "drizzle-orm";
import { db } from "../index.js";
export function selectDidDb(address: string) {
	return db.query.dids.findFirst({
		where: (dids, { eq }) =>
			eq(sql`LOWER(${dids.address})`, address.toLowerCase()),
	});
}
