import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import {
  type TokenItem,
  findTokenByAddress,
  universalDeployments,
} from 'universal-data';
import {
  type DelegationDb,
  decodeEnforcerERC20TransferAmount,
} from 'universal-delegations-sdk';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { type Address, formatUnits } from 'viem';
import { z } from 'zod';
import {
  apiCredentialsClient,
  apiDelegationsClient,
  baseSepoliaPublicClient,
} from '../clients.js';

interface DelegationMetadata {
  data: DelegationDb;
  metadata: {
    available: {
      amount: string;
      amountFormatted: string;
    };
    spent: {
      amount: string;
      amountFormatted: string;
    };
    limit: {
      amount: string;
      amountFormatted: string;
    };
    token: TokenItem;
  };
}

const routeDelegateAddressParams = z.object({
  address: z.custom<Address>((val) => val.length > 10 && val.startsWith('0x'), {
    message: 'invalid address',
  }),
});

const routeDelegateAddressJson = z.object({
  chainId: z.number(),
  type: z.string().optional().default('DebitAuthorization'),
});

const validateDelegateAddressMiddleware = validator(
  'json',
  async (value, c) => {
    const queryParams = routeDelegateAddressJson.safeParse(value);
    if (!queryParams.success) {
      return c.json({ error: 'No chainId provided' }, 400);
    }
    return queryParams.data;
  },
);

const creditRouter = new Hono().post(
  '/delegate/:address',
  validateDelegateAddressMiddleware,
  zValidator('param', routeDelegateAddressParams),
  async (c) => {
    const { address } = c.req.valid('param');
    const jsonData = c.req.valid('json');

    const delegations = await apiDelegationsClient.delegations.delegate[
      ':address'
    ][':type'].$get({
      param: {
        address: address,
        type: jsonData.type,
      },
    });

    if (!delegations.ok) {
      return c.json({ error: 'delegations not found' }, 404);
    }
    const delegationsRes = await delegations.json();

    const delegationWithMetadata: DelegationMetadata[] = [];

    // Once we have the delegations, we want to fetch the onchain data for each delegation.
    // In the current implementation, we're fetching the spent map amount for
    // the ERC20TransferAmount caveat, which is the only caveat we're using for now.
    // We need to be much more robust in the future and fetch all the relevant data for all types.
    for (const delegation of delegationsRes.delegations) {
      // Skip delegations with no caveats.
      // This is a temporary solution to avoid crashing when there are no caveats.
      if (!delegation.caveats[0]?.terms) {
        continue;
      }

      const [_token, _amount] = decodeEnforcerERC20TransferAmount(
        delegation?.caveats[0]?.terms,
      );

      // Find the token metadata for the delegation.
      // TODO: Enable dynamic token metadata fetching.
      const token = findTokenByAddress(_token as Address);

      if (!token) {
        continue;
      }

      // Fetch the spent amount for the delegation.
      // This is the amount that has been spent from the delegation.
      try {
        const res = (await baseSepoliaPublicClient.readContract({
          abi: [
            {
              type: 'function',
              name: 'spentMap',
              inputs: [
                {
                  name: 'delegationManager',
                  type: 'address',
                  internalType: 'address',
                },
                {
                  name: 'delegationHash',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
              ],
              outputs: [
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
          ],
          address: delegation.caveats[0].enforcer,
          functionName: 'spentMap',
          args: [delegation.verifyingContract, delegation.hash],
        })) as bigint;

        delegationWithMetadata.push({
          data: delegation,
          metadata: {
            available: {
              amount: (BigInt(_amount ?? 0) - BigInt(res)).toString(),
              amountFormatted: formatUnits(
                BigInt(_amount ?? 0) - BigInt(res),
                token?.decimals || 18,
              ),
            },
            spent: {
              amount: BigInt(res).toString(),
              amountFormatted: formatUnits(BigInt(res), token?.decimals || 18),
            },
            limit: {
              amount: BigInt(_amount ?? 0).toString(),
              amountFormatted: formatUnits(
                BigInt(_amount ?? 0),
                token?.decimals || 18,
              ),
            },
            token: token,
          },
        });
      } catch (_error) {
        console.error('Error fetching spent amount', _error);
      }
    }

    // TODO: Make a more robust filtering mechanism for the credit endpoint.
    // Right now, we're filtering out delegations with no available amount.
    // This is a temporary solution to avoid showing delegations with no available amount.
    // Long-term we want to check onchain for revocations and other factors that may affect the available amount.
    const filteredDelegationWithMetadata = delegationWithMetadata.filter(
      (delegation) => {
        return delegation.metadata.available.amount !== '0';
      },
    );

    // Create a list of unique DIDs from the delegations delegators.
    // We want to fetch their public credentials to display
    // next to the delegations when relevant.
    const dids = [
      ...(new Set(
        delegationsRes.delegations
          .map((delegation) => delegation.delegator)
          .map((_account) => {
            return constructDidIdentifier({
              chainId: jsonData.chainId,
              resolver: universalDeployments?.[jsonData.chainId]
                ?.resolver as Address,
              address: _account,
            });
          }),
      ) as unknown as [string]),
    ];

    // Fetch the public credentials for the DIDs.
    const credentials = await apiCredentialsClient.credentials.$post({
      json: {
        dids: dids,
      },
    });

    if (!credentials.ok) {
      return c.json({ error: 'credentials not found' }, 404);
    }

    const credentialsRes = await credentials.json();

    if (delegationsRes) {
      return c.json(
        {
          credit: filteredDelegationWithMetadata,
          links: credentialsRes.credentials,
        },
        200,
      );
    }

    return c.json({ error: 'delegations not found' }, 404);
  },
);

export { creditRouter };
