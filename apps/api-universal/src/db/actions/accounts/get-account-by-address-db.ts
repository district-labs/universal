import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';
import { sqlLower } from '../../utils.js';

export function getAccountByAddressDb({ address }: { address: Address }) {
  return db.query.accountsDb.findFirst({
    where: (accounts, { eq }) =>
      and(
        eq(sqlLower(accounts.id), address.toLowerCase()),
        eq(accounts.isActive, true),
      ),
  });
}
