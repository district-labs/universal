import { Hono } from "hono";
import { didRouter } from "./routes/did.js";
import { cors } from 'hono/cors'

const app = new Hono();
app.use('*', cors({
    origin: '*', // or specify allowed origins
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
const appRouter = app.route("/", didRouter);
export type AppRouter = typeof appRouter;
export { app, appRouter };