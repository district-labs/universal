import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { delegationsRouter } from "./delegations.js";

const app = new Hono();

const appRouter = app.route("/delegations", delegationsRouter);

export type AppRouter = typeof appRouter;

const port = 8787;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
