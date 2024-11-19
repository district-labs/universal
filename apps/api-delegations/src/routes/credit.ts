import { Hono } from 'hono';
import { type Address, isAddress } from 'viem';
import { z } from 'zod';
import { getDelegationsCollectionDb } from '../db/actions/delegations/get-delegations-collection-db.js';

const getCollectionQuery = z.object({
  type: z.string().optional(),
  account: z.string().optional(),
  accounts: z.string().optional(),
});

const creditRouter = new Hono().get('/', async (c) => {
  let accounts: Address[] = [];
  const queryParams = getCollectionQuery.safeParse(c.req.query());

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

  // Option 1: Accept a comma-separated list in a single 'accounts' query parameter (e.g., /credentials?accounts=account1,account2)
  if (queryParams?.data?.accounts) {
    accounts = queryParams?.data?.accounts
      .split(',')
      .map((did) => did.trim() as Address);
  } else if (queryParams?.data?.account) {
    // Option 2: Accept a single 'account' query parameter (e.g., /credentials?account=account1)
    accounts = [queryParams?.data?.account as Address];
  }

  // Ensure 'accounts' is an array of valid addresses
  for (const account of accounts) {
    if (!isAddress(account)) {
      return c.json({ error: 'Invalid account address' }, 400);
    }
  }

  try {
    const results = await Promise.all(
      accounts.map((_account) =>
        getDelegationsCollectionDb({
          address: _account,
          type: queryParams?.data?.type || 'DebitAuthorization',
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
