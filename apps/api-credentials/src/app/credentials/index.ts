import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { deconstructDidIdentifier } from 'universal-identity-sdk';
import { z } from 'zod';
import { getCredentialDb } from '../../lib/db/actions/get-credential-db.js';

const credentialsQuery = z.object({
  dids: z.array(z.string()),
});

const validateCredentialsMiddleware = validator('json', async (value, c) => {
  const queryParams = credentialsQuery.safeParse(value);
  if (!queryParams.success) {
    return c.json({ error: 'No DIDs provided' }, 400);
  }
  return queryParams.data;
});

const credentialsApp = new Hono()
  .get('/credentials/:did', async (c) => {
    const subject = c.req.param('did');
    const issuer = c.req.query('issuer');
    const category = c.req.query('category');
    const type = c.req.query('type');

    const credentials = await getCredentialDb({
      issuer,
      subject,
      category,
      type,
    });

    if (!credentials) {
      return c.json({ error: 'No credentials found' }, 404);
    }

    const _credentials = credentials as {
      id: number;
      issuer: string;
      subject: string;
      type: string;
      category: string;
      credential: {
        credentialSubject: {
          id: string;
          [key: string]: string | number | boolean | object;
        };
      };
    }[];

    return c.json({ credentials: _credentials }, 200);
  })

  .post('/credentials', validateCredentialsMiddleware, async (c) => {
    const queryParams = c.req.valid('json');
    const issuer = c.req.query('issuer');
    const category = c.req.query('category');
    const type = c.req.query('type');

    try {
      // Fetch credentials for all DIDs in parallel
      const credentialsPromises = queryParams.dids.map((did) =>
        getCredentialDb({
          issuer,
          subject: did,
          category,
          type,
        }).then((credentials) => ({
          did,
          credentials: credentials || [],
          account: deconstructDidIdentifier(did),
        })),
      );

      const credentialsResults = await Promise.all(credentialsPromises);

      return c.json({ credentials: credentialsResults }, 200);
    } catch (error) {
      console.error('Error fetching credentials for multiple DIDs:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

export { credentialsApp };
