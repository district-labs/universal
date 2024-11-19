// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import type { DelegationDb } from 'api-delegations';
import { Hono } from 'hono';
import { decodeEnforcerERC20TransferAmount } from 'universal-delegations-sdk';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { type Address, formatUnits } from 'viem';
import { z } from 'zod';
import { apiCredentialsClient, apiDelegationsClient } from '../clients.js';
import { getLeaderboardAccounts } from '../db/actions/leaderboard/get-leaderboard-accounts.js';
import type { SelectAccountDb } from '../db/schema.js';

const getLeaderboard = z.object({
  limit: z.string().optional(),
  asset: z.custom<Address>(),
});

export type LeaderboardSearchParams = z.infer<typeof getLeaderboard>;

const leaderboardRouter = new Hono().get(
  '/',
  zValidator('param', getLeaderboard),
  async (c) => {
    const { limit } = c.req.valid('param');
    // if(!asset) {
    //   return c.json({ error: 'Invalid Asset Address' }, 404);
    // }

    const accounts: SelectAccountDb[] | undefined =
      await getLeaderboardAccounts({
        limit,
      });

    const _accounts = accounts.map((_account) => _account.id);

    const _dids = accounts
      .map((_account) => {
        return constructDidIdentifier({
          chainId: 84532,
          resolver: '0x305f57c997A35E79F6a59CF09A9d07d2408b5935',
          address: _account.id,
        });
      })
      .toString();

    const credentials = await apiCredentialsClient.credentials.$get({
      query: {
        dids: _dids,
      },
    });

    const delegations = await apiDelegationsClient.credit.$get({
      param: {
        type: 'DebitAuthorization',
      },
      query: {
        accounts: _accounts.toString(),
      },
    });

    const delegationsRes = await delegations.json();
    if (!delegations.ok || 'error' in delegationsRes) {
      return c.json({ error: 'delegations not found' }, 404);
    }

    const credentialsRes = await credentials.json();
    if (!credentials.ok || 'error' in credentialsRes) {
      return c.json({ error: 'credentials not found' }, 404);
    }

    const _credentials = credentialsRes.credentials;
    const data = accounts.map((account, index) => {
      const _delegations = delegationsRes.collection[index] ?? {
        delegate: [],
        delegator: [],
      };

      return {
        address: account.id,
        did: constructDidIdentifier({
          chainId: 84532,
          resolver: '0x305f57c997A35E79F6a59CF09A9d07d2408b5935',
          address: account.id,
        }),
        creditOut: formatUnits(
          calculateCredit(
            _delegations.delegator,
            // asset,
            '0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B',
          ),
          18,
        ),
        creditIn: formatUnits(
          calculateCredit(
            _delegations.delegate,
            // asset,
            '0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B',
          ),
          18,
        ),
        delegations: _delegations,
        credentials: _credentials[index].credentials.map((data) => ({
          // @ts-expect-error Fix the `never` type on credential
          ...data.credential,
        })),
      };
    });

    if (data) {
      return c.json({ accounts: data }, 200);
    }

    return c.json({ error: 'accounts not found' }, 404);
  },
);

export { leaderboardRouter };

function calculateCredit(
  delegations: DelegationDb[],
  token: Address,
): bigint {
  return delegations.reduce((acc, delegation) => {
    if(!delegation?.caveats?.[0].terms) {
      return acc;
    }
    const [_token, _amount] = decodeEnforcerERC20TransferAmount(
      delegation.caveats[0].terms,
    );
    if (String(_token).toLowerCase() !== token.toLowerCase() || !_amount) {
      return acc;
    }
    return acc + BigInt(_amount);
  }, BigInt(0));
}
