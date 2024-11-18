import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { getLeaderboardAccounts } from '../db/actions/leaderboard/get-leaderboard-accounts.js';
import type { SelectAccountDb } from '../db/schema.js';

const getLeaderboard = z.object({
  limit: z.string().optional()
});

export type LeaderboardSearchParams = z.infer<typeof getLeaderboard>;

const leaderboardRouter = new Hono().get(
  '/',
  zValidator('param', getLeaderboard),
  async (c) => {
    const { limit } = c.req.valid('param');
    const accounts: SelectAccountDb[] | undefined =
      await getLeaderboardAccounts({
        limit,
      });

    if (accounts) {
      return c.json({ accounts }, 200);
    }

    return c.json({ error: 'accounts not found' }, 404);
  },
);

export { leaderboardRouter };
