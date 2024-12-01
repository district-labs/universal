import { type SQL, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

// custom lower function
export function sqlLower(value: AnySQLiteColumn | AnyPgColumn): SQL {
  return sql`lower(${value})`;
}
