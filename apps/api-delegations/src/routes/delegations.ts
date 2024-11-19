import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { Address, Hex } from 'viem';
import { z } from 'zod';
import { getDelegationsByDelegateAndTypeDb } from '../db/actions/delegations/get-delegations-by-delegate-and-type-db.js';
import { getDelegationsByDelegateDb } from '../db/actions/delegations/get-delegations-by-delegate-db.js';
import { getDelegationsByDelegatorAndTypeDb } from '../db/actions/delegations/get-delegations-by-delegator-and-type-db.js';
import { getDelegationsByDelegatorDb } from '../db/actions/delegations/get-delegations-by-delegator-db.js';
import { getDelegationsCollectionDb } from '../db/actions/delegations/get-delegations-collection-db.js';
import { getDelegationsDb } from '../db/actions/delegations/get-delegations-db.js';
import { insertDelegationDb } from '../db/actions/delegations/insert-delegation-db.js';
import { invalidateDelegationDb } from '../db/actions/delegations/invalidate-delegation-db.js';
import type { DelegationDb, SelectDelegationDb } from '../db/schema.js';

// const getCollectionSchema = z.object({
//   type: z.string().refine((val) => val.length > 0, {
//     message: 'invalid type',
//   }),
// });

const getDelegationSchema = z.object({
  hash: z
    .custom<Hex>()
    .refine((val) => val.length === 66 && val.startsWith('0x'), {
      message: 'invalid hash',
    }),
});

const getDelegationByDelegatorOrDelegateSchema = z.object({
  address: z.custom<Address>((val) => val.length > 10 && val.startsWith('0x'), {
    message: 'invalid address',
  }),
});

const getDelegationByDelegatorOrDelegateWithTypeSchema = z.object({
  address: z.custom<Address>((val) => val.length > 10 && val.startsWith('0x'), {
    message: 'invalid address',
  }),
  type: z.string().refine((val) => val.length > 0, {
    message: 'invalid type',
  }),
});

const postDelegationSchema = z.object({
  hash: z.custom<Address>(),
  type: z.string(),
  verifyingContract: z.custom<Address>(),
  chainId: z.number(),
  delegator: z.custom<Address>(),
  delegate: z.custom<Address>(),
  authority: z.custom<Hex>(),
  salt: z.string().transform((val) => BigInt(val)),
  signature: z.custom<Hex>(),
  caveats: z.array(
    z.object({
      enforcerType: z.string(),
      enforcer: z.custom<Address>(),
      terms: z.custom<Hex>(),
      args: z.custom<Hex>(),
    }),
  ),
});

const delegationsRouter = new Hono()

  // Get a delegation by its hash
  .get('/', async (c) => {
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
      return c.json({ error: 'No DIDs provided' }, 400);
    }

    console.log(accounts, 'accounts');

    try {
      // Fetch credentials for all DIDs in parallel
      const delegationsPromises = accounts.map((_account) =>
        getDelegationsCollectionDb({
          address: _account,
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
  })

  // Get a delegation by its hash
  .get('/:hash', zValidator('param', getDelegationSchema), async (c) => {
    const { hash } = c.req.valid('param');
    const delegation: DelegationDb | undefined = await getDelegationsDb({
      hash,
    });

    if (delegation) {
      return c.json({ delegation }, 200);
    }

    return c.json({ error: 'delegation not found' }, 404);
  })

  // Get a delegations by its delegator
  .get(
    '/delegator/:address',
    zValidator('param', getDelegationByDelegatorOrDelegateSchema),
    async (c) => {
      const { address } = c.req.valid('param');
      const delegations: SelectDelegationDb[] | undefined =
        await getDelegationsByDelegatorDb({
          delegator: address,
        });

      if (delegations) {
        return c.json({ delegations }, 200);
      }

      return c.json({ error: 'delegations not found' }, 404);
    },
  )

  // Get a delegations by its delegator
  .get(
    '/delegator/:address/:type',
    zValidator('param', getDelegationByDelegatorOrDelegateWithTypeSchema),
    async (c) => {
      const { address, type } = c.req.valid('param');
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegatorAndTypeDb({
          delegator: address,
          type,
        });

      if (delegations) {
        return c.json({ delegations }, 200);
      }

      return c.json({ error: 'delegations not found' }, 404);
    },
  )

  // Get a delegations by its delegator
  .get(
    '/delegate/:address',
    zValidator('param', getDelegationByDelegatorOrDelegateSchema),
    async (c) => {
      const { address } = c.req.valid('param');
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegateDb({
          delegate: address,
        });

      if (delegations) {
        return c.json({ delegations }, 200);
      }

      return c.json({ error: 'delegations not found' }, 404);
    },
  )

  // Get a delegations by its delegator
  .get(
    '/delegate/:address/:type',
    zValidator('param', getDelegationByDelegatorOrDelegateWithTypeSchema),
    async (c) => {
      const { address, type } = c.req.valid('param');
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegateAndTypeDb({
          delegate: address,
          type,
        });

      if (delegations) {
        return c.json({ delegations }, 200);
      }

      return c.json({ error: 'delegations not found' }, 404);
    },
  )

  .post(
    '/',
    zValidator('json', postDelegationSchema),
    // TODO: validate the signature of the delegation
    async (c) => {
      const delegation = c.req.valid('json');

	  const format = JSON.parse(JSON.stringify(delegation, (_key, value) =>
		typeof value === 'bigint' ? value.toString() : value
	  ));

      // Save the delegation to the database
      try {
        await insertDelegationDb(format);
      } catch (error) {
        console.error(error);
        return c.json({ error: 'failed to save delegation' }, 500);
      }

      return c.json({ delegation: format }, 200);
    },
  )
  .patch(
    'invalidate/:hash',
    zValidator('param', getDelegationSchema),
    // TODO: Expect a signature from the delegator to invalidate the delegation
    async (c) => {
      const { hash } = c.req.valid('param');
      const delegation: SelectDelegationDb[] | undefined =
        await invalidateDelegationDb({
          hash,
        });

      if (delegation && delegation.length > 0) {
        return c.json({ ok: true }, 200);
      }

      return c.json({ error: 'delegation not found' }, 404);
    },
  );

export { delegationsRouter };
