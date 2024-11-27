import { ponder } from '@/generated';
import { isAddress } from 'viem';
import { delegations } from '../../ponder.schema';
import { eq } from '@ponder/core';
import {
  decodeEnforcerERC20TransferAmount,
  decodeErc20TransferAmountEvent,
} from '../utils/delegation/enforcers/erc20-transfer-amount-enforcer';

const creditLineRoute = ponder.get('/credit-line/:redeemer', async (c) => {
  const redeemer = c.req.param('redeemer');

  if (!isAddress(redeemer)) {
    return c.json({ error: 'Invalid address' }, 400);
  }

  const redeemerDelegations = await c.db.query.delegations.findMany({
    where: eq(delegations.redeemer, redeemer),
    with: {
      caveats: true,
      enforcerEvents: true,
    },
  });

  const decodedDelegations = redeemerDelegations
    .filter((delegation) => delegation.delegationType === 'CreditLine')
    .map((delegation) => {
      const erc20TransferFromCaveat = delegation.caveats.find(
        (caveat) => caveat.enforcerType === 'ERC20TransferAmountEnforcer',
      );
      if (!erc20TransferFromCaveat) {
        throw new Error('ERC20TransferAmountEnforcer not found');
      }

      const [token, limit] = decodeEnforcerERC20TransferAmount(
        erc20TransferFromCaveat.terms,
      );

      let totalSpent = 0n;
      const sortedEvents = delegation.enforcerEvents
        .filter((event) => event.enforcerType === 'ERC20TransferAmountEnforcer')
        // Add decoded args to the event object
        .map((event) => {
          const args = decodeErc20TransferAmountEvent(event.args);
          // Get the highest spent amount
          totalSpent = totalSpent > args.spent ? totalSpent : args.spent;
          return {
            ...event,
            args,
          };
        })
        // Sort by spent amount in ascending order
        .sort((a, b) => {
          return a.args.spent > b.args.spent ? 1 : -1;
        });

      const redemptions = sortedEvents.map((event, index) => {
        const redeemed =
          index === 0
            ? event.args.spent
            : event.args.spent - (sortedEvents[index - 1]?.args.spent ?? 0n);
        return {
          timestamp: event.timestamp,
          redeemed,
        };
      });

      return {
        delegation: {
          hash: delegation.hash,
          delegator: delegation.delegator,
        },
        token,
        limit,
        totalSpent,
        redemptions,
      };
    });

  const formattedDelegations = JSON.parse(
    JSON.stringify(
      decodedDelegations,
      (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      2,
    ),
  );
  return c.json(
    {
      creditLines: formattedDelegations,
    },
    200,
  );
});

export type CreditLineRoute = typeof creditLineRoute;
