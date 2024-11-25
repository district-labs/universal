import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { creditRouter } from './routes/credit.js';
import { delegationsRouter } from './routes/delegations.js';

const app = new Hono()
  .use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )
  .route('/credit', creditRouter)
  .route('/delegations', delegationsRouter)
  .notFound((c) => {
    console.error(`not found${c}`);
    return c.text('404 Not found', 404);
  });

export { app };
