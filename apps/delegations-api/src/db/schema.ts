import { relations } from "drizzle-orm";
import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import type { Address, Hex } from 'viem';
import { baseSepolia } from "viem/chains";

// Utils
const addressColumn = () => varchar({ length: 42 }).$type<Address>();
const bytes32Column = () => varchar({ length: 66 }).$type<Hex>();
const bytesColumn = () => text().$type<Hex>();
const bigIntColumn = () => bigint({ mode: "number" }).$type<bigint>();

// ----------------------------------------------
// Delegations
// ----------------------------------------------

// Table
export const delegations = pgTable("delegations", {
  hash: bytes32Column().primaryKey(),
  verifyingContract: addressColumn().notNull(),
  type: varchar({ length: 256 }).notNull(),
  delegator: addressColumn().notNull(),
  chainId: integer().notNull().default(baseSepolia.id),
  delegate: addressColumn().notNull(),
  authority: bytes32Column().notNull(),
  salt: bigIntColumn().notNull(),
  signature: bytesColumn().notNull(),
  isValid: boolean().notNull().default(true),
});

// Relations
export const delegationsRelations = relations(delegations, ({ many }) => ({
  caveats: many(caveats),
}));

// ----------------------------------------------
// Caveats
// ----------------------------------------------

// Table
export const caveats = pgTable("caveats", {
  id: serial("id").primaryKey(),
  enforcerType: varchar({ length: 256 }).notNull(),
  enforcer: addressColumn().notNull(),
  terms: bytesColumn().notNull(),
  args: bytesColumn().notNull(),
  delegationHash: bytes32Column()
    .notNull()
    .references(() => delegations.hash),
});

// Relations
export const caveatsRelations = relations(caveats, ({ one }) => ({
  delegation: one(delegations, {
    fields: [caveats.delegationHash],
    references: [delegations.hash],
  }),
}));

// Types
export type InsertDelegationDb = typeof delegations.$inferInsert;
export type SelectDelegationDb = typeof delegations.$inferSelect;
export type InsertCaveatDb = typeof caveats.$inferInsert;
export type SelectCaveatDb = typeof caveats.$inferSelect;
export type DelegationDb = SelectDelegationDb & {
  caveats: SelectCaveatDb[];
};
