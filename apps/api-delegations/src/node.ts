import { serve } from '@hono/node-server';
import { app } from './app.js';

const port = 3200;
serve({ ...app, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
