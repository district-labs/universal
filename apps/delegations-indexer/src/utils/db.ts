import { sql } from '@ponder/core';

export function sqlLower<Column>(column: Column) {
  return sql`LOWER(${column})`;
}
