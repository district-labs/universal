import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import type { Address } from "viem";

// Utils
const addressColumn = () => varchar({ length: 42 }).$type<Address>();

// ----------------------------------------------
// Accounts
// ----------------------------------------------

// Table
export const accountsDb = pgTable("accounts", {
	id: addressColumn().primaryKey(),
	isActive: boolean().default(false).notNull(),
});

// Types
export type InsertAccountDb = typeof accountsDb.$inferInsert;
export type SelectAccountDb = typeof accountsDb.$inferSelect;
