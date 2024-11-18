import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { Address } from 'viem';
import { z } from 'zod';
import { getAccountByAddressDb } from '../db/actions/accounts/get-account-by-address-db.js';
import { insertAccountDb } from '../db/actions/accounts/insert-account-db.js';
import type { SelectAccountDb } from '../db/schema.js';

const getAccountByAddress = z.object({
  address: z.custom<Address>((val) => val.length > 10 && val.startsWith('0x'), {
    message: 'invalid address',
  }),
});

const postAccountSchema = z.object({
  address: z.custom<Address>(),
});

const accountsRouter = new Hono()
  .get('/:address', zValidator('param', getAccountByAddress), async (c) => {
    const { address } = c.req.valid('param');
    const account: SelectAccountDb | undefined = await getAccountByAddressDb({
      address,
    });

    if (account) {
      return c.json({ account }, 200);
    }

    return c.json({ error: 'account not found' }, 404);
  })

  .post('/', zValidator('json', postAccountSchema), async (c) => {
    const data = c.req.valid('json');
    try {
      await insertAccountDb({
        id: data.address,
        isActive: false,
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: 'failed to save account' }, 500);
    }

    return c.json({ data }, 200);
  });

export { accountsRouter };
