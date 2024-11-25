import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { didRouter } from './routes/did.js';

const app = new Hono()
  .use(
    '*',
    cors({
      origin: '*', // or specify allowed origins
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )
  .route('/', didRouter);

export type IdentityApi = typeof app;

export { app };
