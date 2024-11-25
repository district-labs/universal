import { jsonb, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const credentials = pgTable('credentials', {
  id: serial().primaryKey(),
  issuer: varchar({ length: 255 }).notNull(),
  subject: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  credential: jsonb().notNull(),
});

export type InsertCredentialDb = typeof credentials.$inferInsert;
export type SelectCredentialDb = typeof credentials.$inferSelect;
