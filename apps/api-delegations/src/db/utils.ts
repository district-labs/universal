import { type SQL, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export function sqlLower(column: AnyPgColumn): SQL {
  return sql`LOWER(${column})`;
}
