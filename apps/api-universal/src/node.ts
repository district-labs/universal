import { serve } from '@hono/node-server';
import { app } from './exports/index.js';

const port = 4200;
serve({ ...app, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
