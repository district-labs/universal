import { app, appRouter } from "./app.js";
type AppRouter = typeof appRouter;
import type { InsertDelegationDb } from "./db/schema.js";
export {app, AppRouter, InsertDelegationDb}