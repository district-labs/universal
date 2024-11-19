import type { hc } from "hono/client";
import { app } from "./app.js";
export { didDocumentSchema, type DidDocument } from "./lib/validation/did.js";
export { app };
export type AppRouter = typeof app;
export type IdentityApi = typeof app;
export type UniversalIdentityApiClient = ReturnType<typeof hc<IdentityApi>>;
