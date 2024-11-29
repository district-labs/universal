import type { Hex } from 'viem';
import { db } from '../../index.js';
import { sqlLower } from '../../utils.js';

export function getDelegationsDb({ hash }: { hash: Hex }) {
  return db.query.delegations.findFirst({
    where: (delegations, { eq }) =>
      eq(sqlLower(delegations.hash), hash.toLowerCase()),
    with: {
      caveats: true,
    },
  });
}
