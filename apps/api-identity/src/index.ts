import type { hc } from "hono/client";
import { app, appRouter } from "./app.js";
export { didDocumentSchema, type DidDocument } from "./lib/validation/did.js";
export { app, appRouter };
export type AppRouter = typeof appRouter;
export type UniversalIdentityApiClient = ReturnType<typeof hc<AppRouter>>;
