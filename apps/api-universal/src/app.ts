import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { accountsRouter } from './routes/accounts.js';
import { leaderboardRouter } from './routes/leaderboard.js';

const app = new Hono()
  .use(
    '*',
    cors({
      origin: '*', // or specify allowed origins
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )
  .route('/leaderboard', leaderboardRouter)
  .route('/accounts', accountsRouter)
  .notFound((c) => {
    console.error(`not found${c}`);
    return c.text('404 Not found', 404);
  });

export { app };