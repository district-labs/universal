import { Hono } from "hono";
import { cors } from 'hono/cors'
import { delegationsRouter } from "./routes/delegations.js";

const app = new Hono();
app.use('*', cors({
  origin: '*', // or specify allowed origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const appRouter = app.route("/delegations", delegationsRouter);

app.notFound(c => {
  console.error(`not found${c}`)
  return c.text('404 Not found', 404)
})


export { app, appRouter };