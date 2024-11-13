import { integer, pgTable, varchar, jsonb, serial } from 'drizzle-orm/pg-core';
export const usersTable = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
