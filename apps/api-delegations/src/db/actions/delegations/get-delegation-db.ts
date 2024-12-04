import type { GetDelegationParams } from '../../../validation.js';
import { db } from '../../index.js';

export function getDelegationDb({ hash }: GetDelegationParams) {
  return db.query.delegations.findFirst({
    where: (delegations, { eq }) => eq(delegations.hash, hash),

    with: {
      caveats: true,
    },
  });
}
