import { Hono } from 'hono';
import type { Address } from 'viem';
import { z } from 'zod';
import { getDelegationsCollectionDb } from '../db/actions/delegations/get-delegations-collection-db.js';

const getCollectionParm = z.object({
  type: z.string().refine((val) => val.length > 0, {
    message: 'invalid type',
  }),
});

const getCollectionQuery = z.object({
  account: z
    .string()
    .refine((val) => val.length > 0, {
      message: 'invalid type',
    })
    .optional(),
  accounts: z
    .string()
    .refine((val) => val.length > 0, {
      message: 'invalid type',
    })
    .optional(),
});

const creditRouter = new Hono().get('/', async (c) => {
  let accounts: Address[] | undefined;
  // Option 1: Accept multiple 'account' query parameters (e.g., /credentials?account=account1&account=account2)
  const account = c.req.query('account');

  // Option 2: Accept a comma-separated list in a single 'accounts' query parameter (e.g., /credentials?accounts=account1,account2)
  if (account) {
    accounts = [account as Address];
  } else {
    const didsParam = c.req.query('accounts');
    if (didsParam) {
      accounts = didsParam.split(',').map((did) => did.trim() as Address);
    }
  }

  // Ensure 'dids' is an array
  if (!Array.isArray(accounts)) {
    if (typeof accounts === 'string') {
      accounts = [accounts];
    } else {
      accounts = [];
    }
  }

  // If no DIDs are provided, return a bad request
  if (accounts.length === 0) {
    return c.json({ error: 'No accounts provided' }, 400);
  }

  try {
    // Fetch credentials for all DIDs in parallel
    const delegationsPromises = accounts.map((_account) =>
      getDelegationsCollectionDb({
        address: _account,
        // type: type,
        type: 'DebitAuthorization',
      }),
    );

    const results = await Promise.all(delegationsPromises);

    if (results) {
      return c.json({ collection: results }, 200);
    }

    return c.json({ error: 'delegation collections not found' }, 404);
  } catch (error) {
    console.error('Error fetching delegation collections:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export { creditRouter };
