import { type SQL, sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

// custom lower function
export function lowerSql(value: AnySQLiteColumn): SQL {
  return sql`lower(${value})`;
}
