import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getDelegationDb } from '../db/actions/delegations/get-delegation-db.js';
import { getDelegationsDb } from '../db/actions/delegations/get-delegations-db.js';
import { insertDelegationDb } from '../db/actions/delegations/insert-delegation-db.js';
import { invalidateDelegationDb } from '../db/actions/delegations/invalidate-delegation-db.js';
import type { DelegationDb, SelectDelegationDb } from '../db/schema.js';
import {
  getDelegationSchema,
  getDelegationsSchema,
  postDelegationSchema,
} from '../validation.js';

const delegationsRouter = new Hono()
  // Get a delegation by its hash
  .get('/:hash', zValidator('param', getDelegationSchema), async (c) => {
    const { hash } = c.req.valid('param');
    const delegation: DelegationDb | undefined = await getDelegationDb({
      hash,
    });

    if (delegation) {
      return c.json({ delegation }, 200);
    }

    return c.json({ error: 'delegation not found' }, 404);
  })

  // Get a delegations by multiple parameters
  .post('/get', zValidator('json', getDelegationsSchema), async (c) => {
    const params = c.req.valid('json');
    const delegations: DelegationDb[] | undefined =
      await getDelegationsDb(params);

    if (delegations) {
      return c.json({ delegations }, 200);
    }

    return c.json({ error: 'delegations not found' }, 404);
  })
  .post(
    '/',
    zValidator('json', postDelegationSchema),
    // TODO: validate the signature of the delegation
    async (c) => {
      const delegation = c.req.valid('json');

      const format = JSON.parse(
        JSON.stringify(delegation, (_key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );

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
