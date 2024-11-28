import { Hono } from 'hono';
import { isAddress } from 'viem';

import { env } from '../env.js';
import type { CreditLineResponse } from 'delegations-indexer';

const creditLineRouter = new Hono().get('/:redeemer', async (c) => {
  const redeemer = c.req.param('redeemer');
  try {
    if (!isAddress(redeemer)) {
      return c.json({ error: 'Invalid redeemer address' }, 400);
    }

    const res = await fetch(
      `${env.DELEGATIONS_INDEXER_API_URL}/credit-line/${redeemer}`,
    );

    if (!res.ok) {
      return c.json({ error: 'Error fetching credit lines' }, 500);
    }

    const creditLines: CreditLineResponse = await res.json();

    return c.json(creditLines, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error fetching credit lines' }, 500);
  }
});

export { creditLineRouter };
