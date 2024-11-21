import { createCredential } from '../lib/veramo/actions/create-credential.js';
import { verifyCredential } from '../lib/veramo/actions/verify-credential.js';
import { webDid } from '../lib/veramo/data/did.js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { credentialsApp } from './credentials/index.js';
import { verifyDiscordApp } from './verify/discord.js';
import { verifyGithubApp } from './verify/github.js';
import { verifyXApp } from './verify/x.js';

const app = new Hono()
  .use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )
  .route('/', verifyDiscordApp)
  .route('/', verifyGithubApp)
  .route('/', verifyXApp)
  .route('/', credentialsApp)
  .get('/.well-known/did.json', (c) => {
    return c.json(webDid, 200);
  })
  .post('/issue-credential', async (c) => {
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
  })
  .post(
    '/verify-credential',
    zValidator(
      'json',
      z.object({
        credential: z.record(z.string(), z.string()),
      }),
    ),
    async (c) => {
      try {
        const { credential } = c.req.valid('json');

        const result = await verifyCredential({ credential });
        return c.json({ result }, 200);
      } catch (e) {
        console.error(e);

        return c.json({ error: 'Failed to verify credential' }, 500);
      }
    },
  );

export type CredentialsApi = typeof app;

export { app };
