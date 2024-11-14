import { app, type appRouter } from "./app.js";
export type AppRouter = typeof appRouter;
import type { InsertDelegationDb, SelectDelegationDb, InsertCaveatDb, SelectCaveatDb, DelegationDb } from "./db/schema.js";
export { app, type InsertDelegationDb, type SelectDelegationDb, type InsertCaveatDb, type SelectCaveatDb, type DelegationDb }