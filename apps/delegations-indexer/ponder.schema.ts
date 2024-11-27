import { onchainTable, primaryKey, relations } from '@ponder/core';
import { generateUUID } from './src/utils/uuid';

// ----------------------------------------------
// Delegations
// ----------------------------------------------

// Table
export const delegations = onchainTable(
  'delegations',
  (t) => ({
    hash: t.hex().notNull(),
    chainId: t.integer().notNull(),
    redeemer: t.hex().notNull(),
    delegationType: t.text().notNull(),
    delegate: t.hex().notNull(),
    delegator: t.hex().notNull(),
    authority: t.hex().notNull(),
    salt: t.bigint().notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.hash, table.redeemer] }) }),
);

// Relations
export const delegationsRelations = relations(delegations, ({ many }) => ({
  caveats: many(caveats),
  enforcerEvents: many(enforcerEvents),
}));

// Types
export type InsertDelegation = typeof delegations.$inferInsert;
export type SelectDelegation = typeof delegations.$inferSelect;

// ----------------------------------------------
// Caveats
// ----------------------------------------------

// Table
export const caveats = onchainTable('caveats', (t) => ({
  // Random UUID being generated for the caveat id since it doesn't have a unique identifier
  id: t
    .text()
    .primaryKey()
    .$default(() => generateUUID()),
  enforcerType: t.text().notNull(),
  enforcer: t.hex().notNull(),
  terms: t.hex().notNull(),
  args: t.hex().notNull(),
  delegationHash: t.hex().notNull(),
}));

// Relations
export const caveatsRelations = relations(caveats, ({ one }) => ({
  delegation: one(delegations, {
    fields: [caveats.delegationHash],
    references: [delegations.hash],
  }),
}));

// Types
export type InsertCaveat = typeof caveats.$inferInsert;
export type SelectCaveat = typeof caveats.$inferSelect;

// ----------------------------------------------
// Enforcer Events
// ----------------------------------------------

// Table
export const enforcerEvents = onchainTable('enforcer_events', (t) => ({
  // Random UUID being generated for the delegation redemption id since it doesn't have a unique identifier
  id: t
    .text()
    .primaryKey()
    .$default(() => generateUUID()),
  timestamp: t.bigint().notNull(),
  event: t.text().notNull(),
  redeemer: t.hex().notNull(),
  enforcer: t.hex().notNull(),
  enforcerType: t.text().notNull(),
  args: t.hex().notNull(),
  delegationHash: t.hex().notNull(),
}));

// Relations
export const enforcerEventsRelations = relations(enforcerEvents, ({ one }) => ({
  delegation: one(delegations, {
    fields: [enforcerEvents.delegationHash],
    references: [delegations.hash],
  }),
}));

// Types
export type InsertEnforcerEvents = typeof enforcerEvents.$inferInsert;
export type SelectEnforcerEvents = typeof enforcerEvents.$inferSelect;
