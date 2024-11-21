import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { apiDelegationsClient } from '../clients.js';
import { getAccountByAddress } from '../schemas.js';

const creditRouter = new Hono().post(
  '/delegate/:address',
  zValidator('param', getAccountByAddress),
  async (c) => {
    const { address } = c.req.valid('param');

    const delegations = await apiDelegationsClient.delegations.delegate[
      ':address'
    ][':type'].$get({
      param: {
        address: address,
        type: 'DebitAuthorization',
      },
    });

    if (!delegations.ok) {
      return c.json({ error: 'delegations not found' }, 404);
    }
    const delegationsRes = await delegations.json();

    if (delegationsRes) {
      return c.json({ credit: delegationsRes.delegations }, 200);
    }

    return c.json({ error: 'delegations not found' }, 404);
  },
);

export { creditRouter };
