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

    interface DelegationMetadata {
      data: DelegationDb;
      metadata: {
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

    const delegationWithMetadata: DelegationMetadata[] = [];

    for (const delegation of delegationsRes.delegations) {
      const [_token, _amount] = decodeEnforcerERC20TransferAmount(
        delegation.caveats[0].terms,
      );
      const token = findTokenByAddress(_token as Address);

      if (!token) {
        continue;
      }

      const res = await baseSepoliaPublicClient.readContract({
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
      });

      delegationWithMetadata.push({
        data: delegation,
        metadata: {
          spent: {
            amount: BigInt(res).toString(),
            amountFormatted: formatUnits(BigInt(res), token?.decimals || 18),
          },
          limit: {
            amount: BigInt(_amount).toString(),
            amountFormatted: formatUnits(
              BigInt(_amount),
              token?.decimals || 18,
            ),
          },
          token: token,
        },
      });
    }

    const dids = [
      ...new Set(
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
      ),
    ];

    const credentials = await apiCredentialsClient.credentials.$post({
      json: {
        dids: dids,
      },
    });

    const credentialsRes = await credentials.json();

    if (delegationsRes) {
      return c.json(
        { credit: delegationWithMetadata, links: credentialsRes.credentials },
        200,
      );
    }

    return c.json({ error: 'delegations not found' }, 404);
  },
);

export { creditRouter };
