import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { type TokenItem, findToken, getDefaultTokenList } from 'universal-data';
import {
  type DelegationDb,
  decodeEnforcerERC20TransferAmount,
} from 'universal-delegations-sdk';
import { type Address, formatUnits } from 'viem';
import { getCredentialsByAddresses } from './utils/get-credentials-by-addresses.js';
import { getIssuedDelegations } from './utils/get-issued-delegations.js';
import { getRedeemedCreditLines } from './utils/get-redeemed-credit-Lines.js';
import { getCreditLineSchema } from './utils/validation.js';

type DelegationDbWithOnchainData = DelegationDb & {
  isRevoked: boolean;
};

type DelegationMetadata = {
  data: DelegationDbWithOnchainData;
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
    redemptions: {
      timestamp: string;
      blockNumber: number;
      transactionHash: string;
      redeemed: string;
      redeemedFormatted: string;
    }[];
    token: TokenItem;
  };
};

const creditLineRouter = new Hono().post(
  '/',
  zValidator('json', getCreditLineSchema),
  async (c) => {
    const params = c.req.valid('json');
    const { chainId } = params;
    try {
      const [redeemCreditLinesResponse, issuedDelegationsResponse] =
        await Promise.all([
          getRedeemedCreditLines({ ...params }),
          getIssuedDelegations(params),
        ]);

      if (!redeemCreditLinesResponse.ok) {
        return c.json({ error: redeemCreditLinesResponse.error }, 500);
      }

      if (!issuedDelegationsResponse.ok) {
        return c.json({ error: issuedDelegationsResponse.error }, 500);
      }

      const { creditLines: redeemedCreditLines } = redeemCreditLinesResponse;
      const { delegations: issuedDelegations } = issuedDelegationsResponse;
      // Gets all addresses of delegates and delegators
      const addresses: Set<Address> = new Set();

      issuedDelegations.delegations.forEach(({ delegate, delegator }) => {
        addresses.add(delegator);
        addresses.add(delegate);
      });

      const { credentials } = await getCredentialsByAddresses({
        addresses: Array.from(addresses),
        chainId,
      });

      const creditLines: DelegationMetadata[] =
        issuedDelegations.delegations.map((delegation) => {
          // Filter the redeemed credit lines for the current delegation hash
          const redemptions = redeemedCreditLines.creditLines.find(
            (redeemedCreditLine) => {
              return (
                redeemedCreditLine.delegation.hash.toLowerCase() ===
                delegation.hash.toLowerCase()
              );
            },
          );

          const terms = delegation.caveats[0]?.terms;

          if (!terms) {
            throw new Error('No terms found for delegation');
          }

          const [token, limit] = decodeEnforcerERC20TransferAmount(terms);
          const tokenList = getDefaultTokenList({ chainId });
          const tokenData = findToken({ address: token, tokenList });

          if (!tokenData) {
            throw new Error('Token not found');
          }

          // If there's no redemption for the current delegation the total spent is 0
          const spent = redemptions?.totalSpent
            ? BigInt(redemptions?.totalSpent)
            : 0n;
          const available = limit - spent;

          const redemptionsFormatted = redemptions?.redemptions.map(
            (redemption) => ({
              ...redemption,
              redeemedFormatted: formatUnits(
                BigInt(redemption.redeemed),
                tokenData.decimals,
              ),
            }),
          );

          return {
            data: {
              ...delegation,
              isRevoked:
                typeof redemptions?.delegation?.isEnabled === 'undefined'
                  ? false
                  : !redemptions?.delegation?.isEnabled,
            },
            metadata: {
              token: tokenData,
              available: {
                amount: available.toString(),
                amountFormatted: formatUnits(available, tokenData.decimals),
              },
              spent: {
                amount: spent.toString(),
                amountFormatted: formatUnits(spent, tokenData.decimals),
              },
              limit: {
                amount: limit.toString(),
                amountFormatted: formatUnits(limit, tokenData.decimals),
              },
              redemptions: redemptionsFormatted ?? [],
            },
          };
        });

      return c.json(
        {
          creditLines,
          credentials,
        },
        200,
      );
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Error fetching credit lines' }, 500);
    }
  },
);

export { creditLineRouter };
