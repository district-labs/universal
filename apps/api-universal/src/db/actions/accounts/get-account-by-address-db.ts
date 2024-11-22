import { and } from 'drizzle-orm';
import type { Address } from 'viem';
import { db } from '../../index.js';

export function getAccountByAddressDb({ address }: { address: Address }) {
  return db.query.accountsDb.findFirst({
    where: (accounts, { eq }) =>
      and(eq(accounts.id, address), eq(accounts.isActive, true)),
  });
}
