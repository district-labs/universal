import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { findTokenByAddress, universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { type Address, formatUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { z } from 'zod';
import { apiCredentialsClient, apiDelegationsClient } from '../clients.js';
import { getLeaderboardAccounts } from '../db/actions/leaderboard/get-leaderboard-accounts.js';
import type { SelectAccountDb } from '../db/schema.js';
import { calculateERC20TransferAmountEnforcerCollectionTotal } from '../utils/calculate-erc20-transfer-amount-enforcer-collection-total.js';

const allowedChainIds = [Number(base.id), Number(baseSepolia.id)]; // List of allowed chain IDs
const leaderboardQuery = z.object({
  asset: z.custom<Address>(),
  chainId: z.number().refine((value) => allowedChainIds.includes(value), {
    message: 'Invalid chainId',
  }),
  limit: z.number().optional(),
});

export type LeaderboardSearchParams = z.infer<typeof leaderboardQuery>;

const validateDidMiddleware = validator('json', async (value, c) => {
  const queryParams = leaderboardQuery.safeParse(value);
  if (!queryParams.success) {
    return c.json({ error: 'No asset or chainId provided' }, 400);
  }
  return queryParams.data;
});

const leaderboardRouter = new Hono().post(
  '/',
  validateDidMiddleware,
  async (c) => {
    const params = c.req.valid('json');

    const accounts: SelectAccountDb[] | undefined =
      await getLeaderboardAccounts({
        limit: params.limit || 50,
      });

    const _resolver = universalDeployments.Resolver;

    // TODO: Check if chainID is supported
    // if (!_resolver || !isAddress(_resolver)) {
    //   return c.json({ error: 'Resolver not found' }, 404);
    // }

    const _accounts = accounts.map((_account) => _account.id);
    const _dids = _accounts.map((_account) => {
      return constructDidIdentifier({
        chainId: Number(params.chainId),
        resolver: _resolver,
        address: _account,
      });
    });

    const credentials = await apiCredentialsClient.credentials.$post({
      json: {
        dids: _dids,
      },
    });

    const delegations = await apiDelegationsClient.credit.$post({
      json: {
        accounts: _accounts,
        type: 'DebitAuthorization',
      },
    });

    if (!credentials.ok) {
      return c.json({ error: 'credentials not found' }, 404);
    }
    const credentialsRes = await credentials.json();

    if (!delegations.ok) {
      return c.json({ error: 'delegations not found' }, 404);
    }
    const delegationsRes = await delegations.json();

    const _credentials = credentialsRes.credentials;
    const data = accounts.map((account, index) => {
      // TODO: Make a better "normalization" function for the credentials.
      // We can't rely on consistent ordering from the API.
      const _delegations = delegationsRes.collection[index] ?? {
        delegate: [],
        delegator: [],
      };

      const _token = findTokenByAddress(params.asset);
      if (!_token) {
        return c.json({ error: 'Token not supported' }, 404);
      }

      // TODO: Make a better "normalization" function for the credentials.
      // We can't rely on consistent ordering from the API.
      const _accountCredentials = _credentials?.[index]?.credentials ?? [];

      // TODO: As we add more enforcers to the DebitAuthorization delegation type,
      // we need to add more logic to correctly calculate the credit by identifying
      // the `ERC20TransferAmountEnforcer` enforcer terms before decoding the amount
      // in the calculateERC20TransferAmountEnforcerCollectionTotal function.
      return {
        address: account.id,
        did: constructDidIdentifier({
          chainId: Number(params.chainId),
          resolver: _resolver,
          address: account.id,
        }),
        creditOut: formatUnits(
          calculateERC20TransferAmountEnforcerCollectionTotal(
            _delegations.delegator,
            params.asset,
          ),
          _token.decimals,
        ),
        creditIn: formatUnits(
          calculateERC20TransferAmountEnforcerCollectionTotal(
            _delegations.delegate,
            params.asset,
          ),
          _token.decimals,
        ),
        delegations: _delegations,
        credentials: _accountCredentials.map((data) => ({
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
