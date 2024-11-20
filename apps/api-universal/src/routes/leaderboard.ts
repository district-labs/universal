import { Hono } from 'hono';
import { findTokenByAddress, universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { type Address, formatUnits, isAddress } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { z } from 'zod';
import { apiCredentialsClient, apiDelegationsClient } from '../clients.js';
import { getLeaderboardAccounts } from '../db/actions/leaderboard/get-leaderboard-accounts.js';
import type { SelectAccountDb } from '../db/schema.js';
import { calculateERC20TransferAmountEnforcerCollectionTotal } from '../utils/calculate-erc20-transfer-amount-enforcer-collection-total.js';

const allowedChainIds = [String(base.id), String(baseSepolia.id)]; // List of allowed chain IDs
const leaderboardQuery = z.object({
  asset: z.custom<Address>(),
  chainId: z.string().refine((value) => allowedChainIds.includes(value), {
    message: 'Invalid chainId',
  }),
  limit: z.string().optional(),
});

export type LeaderboardSearchParams = z.infer<typeof leaderboardQuery>;

const leaderboardRouter = new Hono().get('/', async (c) => {
  const queryParams = leaderboardQuery.safeParse(c.req.query());
  if (!queryParams.success) {
    return c.json({ error: 'No asset or chainId provided' }, 400);
  }
  const accounts: SelectAccountDb[] | undefined = await getLeaderboardAccounts({
    limit: queryParams.data.limit || '50',
  });

  const _resolver =
    universalDeployments?.[Number(queryParams?.data?.chainId)]?.resolver;
  if (!_resolver || !isAddress(_resolver)) {
    return c.json({ error: 'Resolver not found' }, 404);
  }

  const _accounts = accounts.map((_account) => _account.id);
  const _dids = _accounts.map((_account) => {
    return constructDidIdentifier({
      chainId: Number(queryParams.data.chainId),
      resolver: _resolver,
      address: _account,
    });
  });

  const credentials = await apiCredentialsClient.credentials.$get({
    query: {
      dids: _dids.toString(),
    },
  });

  const delegations = await apiDelegationsClient.credit.$get({
    query: {
      accounts: _accounts.toString(),
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

    const _token = findTokenByAddress(queryParams.data.asset);
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
        chainId: Number(queryParams.data.chainId),
        resolver: _resolver,
        address: account.id,
      }),
      creditOut: formatUnits(
        calculateERC20TransferAmountEnforcerCollectionTotal(
          _delegations.delegator,
          queryParams.data.asset,
        ),
        _token.decimals,
      ),
      creditIn: formatUnits(
        calculateERC20TransferAmountEnforcerCollectionTotal(
          _delegations.delegate,
          queryParams.data.asset,
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
});

export { leaderboardRouter };
