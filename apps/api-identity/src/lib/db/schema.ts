import { pgTable, text } from "drizzle-orm/pg-core";
// ----------------------------------------------
// DIDs
// ----------------------------------------------

// Table
export const dids = pgTable("dids", {
	address: text().primaryKey(),
	resolver: text().notNull(),
	identifier: text().notNull(),
	document: text().notNull(),
	signature: text().notNull(),
});

// Types
export type InsertDidDb = typeof dids.$inferInsert;
export type SelectDidDb = typeof dids.$inferSelect;
