import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { isAddress, type Address, type Hex, isHex } from 'viem';
import { z } from 'zod';
import { getDelegationsByDelegateAndTypeDb } from '../db/actions/delegations/get-delegations-by-delegate-and-type-db.js';
import { getDelegationsByDelegateDb } from '../db/actions/delegations/get-delegations-by-delegate-db.js';
import { getDelegationsByDelegatorAndTypeDb } from '../db/actions/delegations/get-delegations-by-delegator-and-type-db.js';
import { getDelegationsByDelegatorDb } from '../db/actions/delegations/get-delegations-by-delegator-db.js';
import { getDelegationsDb } from '../db/actions/delegations/get-delegations-db.js';
import { insertDelegationDb } from '../db/actions/delegations/insert-delegation-db.js';
import { invalidateDelegationDb } from '../db/actions/delegations/invalidate-delegation-db.js';
import type { DelegationDb, SelectDelegationDb } from '../db/schema.js';
import { isValidChain } from 'universal-data';

const hexSchema = z
  .custom<Hex>()
  .refine((val) => val.length === 66 && isHex(val), {
    message: 'invalid hash',
  });

const addressSchema = z.string().refine(isAddress, {
  message: 'invalid address',
});

const chainIdSchema = z.coerce.number().refine((val) => isValidChain(val), {
  message: 'invalid chainId',
});

const getDelegationSchema = z.object({
  hash: hexSchema,
});

const getDelegationByDelegatorOrDelegateSchema = z.object({
  address: addressSchema,
  chainId: chainIdSchema,
});

const getDelegationByDelegatorOrDelegateWithTypeSchema = z.object({
  address: addressSchema,
  chainId: chainIdSchema,
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
    '/delegator/:chainId/:address',
    zValidator('param', getDelegationByDelegatorOrDelegateSchema),
    async (c) => {
      const { address, chainId } = c.req.valid('param');
      const delegations: SelectDelegationDb[] | undefined =
        await getDelegationsByDelegatorDb({
          chainId,
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
    '/delegator/:chainId/:address/:type',
    zValidator('param', getDelegationByDelegatorOrDelegateWithTypeSchema),
    async (c) => {
      const { address, chainId, type } = c.req.valid('param');
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegatorAndTypeDb({
          chainId,
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
    '/delegate/:chainId/:address',
    zValidator('param', getDelegationByDelegatorOrDelegateSchema),
    async (c) => {
      const { address, chainId } = c.req.valid('param');
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegateDb({
          chainId,
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
    '/delegate/:chainId/:address/:type',
    zValidator('param', getDelegationByDelegatorOrDelegateWithTypeSchema),
    async (c) => {
      const { address, type, chainId } = c.req.valid('param');
      console.log({ address, type, chainId });
      const delegations: DelegationDb[] | undefined =
        await getDelegationsByDelegateAndTypeDb({
          chainId,
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
