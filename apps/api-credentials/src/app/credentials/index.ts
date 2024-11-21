import { getCredentialDb } from '../../lib/db/actions/get-credential-db.js';
import { Hono } from 'hono';

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
  .get('/credentials', async (c) => {
    let dids: string[] | undefined;
    // Option 1: Accept multiple 'did' query parameters (e.g., /credentials?did=did1&did=did2)
    const did = c.req.query('did');

    // Option 2: Accept a comma-separated list in a single 'dids' query parameter (e.g., /credentials?dids=did1,did2)
    if (did) {
      dids = [did];
    } else {
      const didsParam = c.req.query('dids');
      if (didsParam) {
        dids = didsParam.split(',').map((did) => did.trim());
      }
    }

    // Ensure 'dids' is an array
    if (!Array.isArray(dids)) {
      if (typeof dids === 'string') {
        dids = [dids];
      } else {
        dids = [];
      }
    }

    // If no DIDs are provided, return a bad request
    if (dids.length === 0) {
      return c.json({ error: 'No DIDs provided' }, 400);
    }

    const issuer = c.req.query('issuer');
    const category = c.req.query('category');
    const type = c.req.query('type');

    try {
      // Fetch credentials for all DIDs in parallel
      const credentialsPromises = dids.map((did) =>
        getCredentialDb({
          issuer,
          subject: did,
          category,
          type,
        }).then((credentials) => ({
          did,
          credentials: credentials || [],
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
