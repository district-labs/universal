import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { createCredential } from '../lib/veramo/actions/create-credential.js';
import { webDid } from '../lib/veramo/data/did.js';
import { verifyCredential } from '../lib/veramo/actions/verify-credential.js';
import { verifyXApp } from './verify/x.js';

const app = new Hono();

app.route('/', verifyXApp);

app.get('/.well-known/did.json', (c) => {
  return c.json(webDid, 200);
});

// TODO: Add body validation
app.post('/issue-credential', async (c) => {
  try {
    const body = await c.req.json();

    if (
      !body?.credentialSubject ||
      typeof body?.credentialSubject !== 'object'
    ) {
      return c.json({ error: 'credentialSubject is required' }, 400);
    }
    const { credentialSubject } = body;

    const result = await createCredential({ credentialSubject });
    return c.json({ ok: true, credential: result }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to create credential' }, 500);
  }
});

// TODO: Add body validation
app.post('/verify-credential', async (c) => {
  try {
    const body = await c.req.json();

    if (!body?.credential || typeof body?.credential !== 'object') {
      return c.json({ error: 'credential is required' }, 400);
    }
    const { credential } = body;

    const result = await verifyCredential({ credential });
    return c.json({ result }, 200);
  } catch (e) {
    console.error(e);

    return c.json({ error: 'Failed to verify credential' }, 500);
  }
});

const port = 8787;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
