import { serve } from '@hono/node-server';
import { app } from './index.js';

const port = 3100;

serve({
  fetch: app.fetch,
  port,
});
