import { ponder } from '@/generated';
import { zValidator } from '@hono/zod-validator';
import { and, eq } from '@ponder/core';
import { delegations } from '../../../ponder.schema.js';
import {
  decodeEnforcerERC20TransferAmount,
  decodeErc20TransferAmountEvent,
} from '../../utils/delegation/enforcers/erc20-transfer-amount-enforcer.js';

import type { RedeemedCreditLinesResponse } from './types.js';

import { sqlLower } from '../../utils/db.js';
import { redeemedCreditLineSchema } from '../../validation/credit-lines.js';

ponder.get(
  '/redeemed-credit-lines',
  zValidator('query', redeemedCreditLineSchema),
  async (c) => {
    const { delegate, delegator } = c.req.valid('query');

    try {
      const conditions: ReturnType<typeof eq>[] = [];
      // Adds conditions to the query based on delegate and delegator

      if (delegate) {
        conditions.push(
          eq(sqlLower(delegations.delegate), delegate.toLowerCase()),
        );
      }
      if (delegator) {
        conditions.push(
          eq(sqlLower(delegations.delegator), delegator.toLowerCase()),
        );
      }

      const redeemerDelegations = await c.db.query.delegations.findMany({
        // We're assuming the delegate is not ANY_DELEGATE
        where: and(...conditions),
        with: {
          caveats: true,
          enforcerEvents: true,
        },
      });

      const creditLines = redeemerDelegations
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
            .filter(
              (event) => event.enforcerType === 'ERC20TransferAmountEnforcer',
            )
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
                : event.args.spent -
                  (sortedEvents[index - 1]?.args.spent ?? 0n);
            return {
              blockNumber: Number(event.blockNumber),
              transactionHash: event.transactionHash,
              timestamp: event.timestamp.toString(),
              redeemed: redeemed.toString(),
            };
          });

          return {
            delegation: {
              hash: delegation.hash,
              delegator: delegation.delegator,
              delegate: delegation.delegate,
            },
            token,
            limit: limit.toString(),
            totalSpent: totalSpent.toString(),
            redemptions,
          };
        });

      const response: RedeemedCreditLinesResponse = {
        creditLines,
      };
      return c.json(response, 200);
    } catch (e) {
      const error =
        e instanceof Error
          ? e.message
          : 'An error occurred while fetching credit lines';
      return c.json({ error }, 500);
    }
  },
);
