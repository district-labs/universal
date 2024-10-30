import { pgTable, varchar } from 'drizzle-orm/pg-core';

// Utils
const addressColumn = () => varchar({ length: 42 });
const bytes64Column = () => varchar({ length: 130 });

// Tables
export const initialOwners = pgTable('initial_owners', {
  publicKey: bytes64Column().primaryKey(),
  credentialId: varchar({ length: 255 }).notNull(),
  smartContractAddress: addressColumn().notNull(),
});

export type SelectInitialOwner = typeof initialOwners.$inferSelect;
export type InsertInitialOwner = typeof initialOwners.$inferInsert;
