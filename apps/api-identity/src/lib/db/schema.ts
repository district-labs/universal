import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// ----------------------------------------------
// DIDs
// ----------------------------------------------

// Table
export const dids = sqliteTable("dids", {
  address: text().primaryKey(),
  identifier: text().notNull(),
  document: text().notNull(),
  signature: text().notNull(),
});

// Types
export type InsertDidDb = typeof dids.$inferInsert;
export type SelectDidDb = typeof dids.$inferSelect;
