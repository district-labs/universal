import { hc } from "hono/client";
import { app, appRouter } from "./app.js";
export type AppRouter = typeof appRouter;
export type UniversalIdentityApiClient = ReturnType<typeof hc<AppRouter>>;
export { app, appRouter };
