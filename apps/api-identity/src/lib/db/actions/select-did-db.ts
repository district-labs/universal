import { db } from '../index.js';
import { sqlLower } from '../utils.js';
export function selectDidDb(address: string) {
  return db.query.dids.findFirst({
    where: (dids, { eq }) => eq(sqlLower(dids.address), address.toLowerCase()),
  });
}
