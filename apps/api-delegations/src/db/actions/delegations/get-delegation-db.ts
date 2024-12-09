import type { DelegationWithMetadata } from 'universal-types';
import type { GetDelegationParams } from '../../../validation.js';
import { db } from '../../index.js';
import {
  MAX_DELEGATION_DEPTH,
  buildAuthConfig,
  replaceAuthKeys,
} from './utils.js';

type GetDelegationDbReturnType = Promise<DelegationWithMetadata | undefined>;

export async function getDelegationDb({
  hash,
}: GetDelegationParams): GetDelegationDbReturnType {
  const delegation = await db.query.delegations.findFirst({
    where: (delegations, { eq }) => eq(delegations.hash, hash),
    with: {
      // Supports MAX_DELEGATION_DEPTH levels of parent recursion
      caveats: true,
      auth: buildAuthConfig(MAX_DELEGATION_DEPTH),
    },
  });

  if (!delegation) {
    return;
  }

  // Recursively update auth for authorityDelegation
  return replaceAuthKeys(delegation);
}
