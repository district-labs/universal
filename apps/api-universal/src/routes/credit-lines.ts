import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { env } from '../env.js';
import {
  type RedeemedCreditLinesResponse,
  redeemedCreditLineSchema,
} from 'delegations-indexer';

const creditLineRouter = new Hono().post(
  '/redeemed-credit-lines',
  zValidator('json', redeemedCreditLineSchema),
  async (c) => {
    const { delegate, delegator } = c.req.valid('json');
    try {
      const redeemedCreditLinesUrl = new URL(
        `${env.DELEGATIONS_INDEXER_API_URL}/redeemed-credit-lines`,
      );

      if (delegate) {
        redeemedCreditLinesUrl.searchParams.append('delegate', delegate);
      }
      if (delegator) {
        redeemedCreditLinesUrl.searchParams.append('delegator', delegator);
      }

      const res = await fetch(redeemedCreditLinesUrl);

      if (!res.ok) {
        return c.json({ error: 'Error fetching credit lines' }, 500);
      }

      const creditLines: RedeemedCreditLinesResponse = await res.json();

      return c.json(creditLines, 200);
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Error fetching credit lines' }, 500);
    }
  },
);

export { creditLineRouter };
