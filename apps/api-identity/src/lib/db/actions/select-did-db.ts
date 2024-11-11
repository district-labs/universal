import { db } from "../index.js";
import { lowerSql } from "../utils.js";

export function selectDidDb(address: string) {
	return db.query.dids.findFirst({
		where: (dids, { eq }) => eq(lowerSql(dids.address), address.toLowerCase()),
	});
}
