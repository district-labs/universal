import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getDelegationDb } from '../db/actions/delegations/get-delegation-db.js';
import { getDelegationsDb } from '../db/actions/delegations/get-delegations-db.js';
import { insertDelegationDb } from '../db/actions/delegations/insert-delegation-db.js';
import { invalidateDelegationDb } from '../db/actions/delegations/invalidate-delegation-db.js';
import {
  getDelegationSchema,
  getDelegationsSchema,
  postDelegationSchema,
} from '../validation.js';
import type { DelegationWithMetadata } from 'universal-types';
import { processDelegation } from '../processing/process-delegation.js';

const delegationsRouter = new Hono()
  // Get a delegation by its hash
  .get('/:hash', zValidator('param', getDelegationSchema), async (c) => {
    try {
      const { hash } = c.req.valid('param');
      const delegation: DelegationWithMetadata | undefined =
        await getDelegationDb({
          hash,
        });

      if (delegation) {
        return c.json({ delegation }, 200);
      }

      return c.json({ error: 'delegation not found' }, 404);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'error fetching delegation';
      return c.json({ error: errorMessage }, 500);
    }
  })

  // Get a delegations by multiple parameters
  .post('/get', zValidator('json', getDelegationsSchema), async (c) => {
    const params = c.req.valid('json');
    const delegations: DelegationWithMetadata[] | undefined =
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
      const rawDelegation = c.req.valid('json');

      const delegation = JSON.parse(
        JSON.stringify(rawDelegation, (_key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );

      try {
        await Promise.all([
          // Process any necessary delegation side effects
          processDelegation({
            chainId: delegation.chainId,
            delegation,
          }),
          // Save the delegation to the database
          insertDelegationDb(delegation),
        ]);
      } catch (error) {
        console.error(error);
        return c.json({ error: 'failed to save delegation' }, 500);
      }

      return c.json({ delegation }, 200);
    },
  )
  .patch(
    'invalidate/:hash',
    zValidator('param', getDelegationSchema),
    // TODO: Expect a signature from the delegator to invalidate the delegation
    async (c) => {
      const { hash } = c.req.valid('param');
      const delegation:
        | Omit<DelegationWithMetadata, 'caveats' | 'authorityDelegation'>[]
        | undefined = await invalidateDelegationDb({
        hash,
      });

      if (delegation && delegation.length > 0) {
        return c.json({ ok: true }, 200);
      }

      return c.json({ error: 'delegation not found' }, 404);
    },
  );

export { delegationsRouter };
