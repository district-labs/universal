import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { type Address, isAddress } from 'viem';
import { z } from 'zod';
import { getDelegationsCollectionDb } from '../db/actions/delegations/get-delegations-collection-db.js';

const getCollectionQuery = z.object({
  type: z.string().optional(),
  account: z.custom<Address>().optional(),
  accounts: z.array(z.custom<Address>()).optional(),
});

const validateDidMiddleware = validator('json', async (value, c) => {
  const queryParams = getCollectionQuery.safeParse(value);
  if (
    !queryParams.success ||
    (!queryParams?.data?.account && !queryParams?.data?.accounts)
  ) {
    return c.json({ error: 'No accounts provided' }, 400);
  }

  if (queryParams?.data?.account && queryParams?.data?.accounts) {
    return c.json(
      { error: 'Both account and accounts query parameters are provided' },
      400,
    );
  }
  return queryParams.data;
});

const creditRouter = new Hono().post('/', validateDidMiddleware, async (c) => {
  let accounts: Address[] = [];
  const queryParams = c.req.valid('json');

  if (queryParams?.accounts) {
    accounts = queryParams?.accounts;
  } else if (queryParams?.account) {
    accounts = [queryParams?.account];
  }

  // Ensure 'accounts' is an array of valid addresses
  for (const account of accounts) {
    if (!isAddress(account)) {
      return c.json({ error: 'Invalid account addresses' }, 400);
    }
  }

  try {
    const results = await Promise.all(
      accounts.map((_account) =>
        getDelegationsCollectionDb({
          address: _account,
          type: queryParams?.type || 'DebitAuthorization',
        }),
      ),
    );

    if (results) {
      return c.json({ collection: results }, 200);
    }

    return c.json({ error: 'Delegations Collections' }, 404);
  } catch (_error) {
    return c.json({ error: 'Error: Internal Server Error' }, 500);
  }
});

export { creditRouter };
