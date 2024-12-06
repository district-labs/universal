import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';
import { sqlLower } from '../../utils.js';
import {
  MAX_DELEGATION_DEPTH,
  buildAuthConfig,
  replaceAuthKeys,
} from './utils.js';
import type { DelegationWithMetadata } from 'universal-types';

type GetDelegationsCollectionDbReturnType = {
  delegate: DelegationWithMetadata[];
  delegator: DelegationWithMetadata[];
};

export async function getDelegationsCollectionDb({
  address,
  chainId,
  type,
}: {
  address: Address;
  chainId: number;
  type: string;
}): Promise<GetDelegationsCollectionDbReturnType> {
  const lowercasedAddress = address.toLowerCase();

  const [delegate, delegator] = await db.transaction(async (tx) =>
    Promise.all([
      tx.query.delegations.findMany({
        where: (delegations, { eq }) =>
          and(
            eq(sqlLower(delegations.delegate), lowercasedAddress),
            eq(delegations.type, type),
            eq(delegations.chainId, chainId),
          ),
        with: {
          caveats: true,
          auth: buildAuthConfig(MAX_DELEGATION_DEPTH),
        },
      }),
      tx.query.delegations.findMany({
        where: (delegations, { eq }) =>
          and(
            eq(sqlLower(delegations.delegator), lowercasedAddress),
            eq(delegations.type, type),
            eq(delegations.chainId, chainId),
          ),
        with: {
          caveats: true,
          auth: buildAuthConfig(MAX_DELEGATION_DEPTH),
        },
      }),
    ]),
  );

  return {
    delegate: delegate.map(replaceAuthKeys),
    delegator: delegator.map(replaceAuthKeys),
  };
}
