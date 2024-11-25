import { eq } from 'drizzle-orm';
import type { Address, Hex } from 'viem';
import { db } from '..';
import { initialOwners as initialOwnersDb } from '../schema';
import { lower } from '../utils';

export function getInitialOwnerByPublicKeyDb(publicKey: Hex) {
  return db.query.initialOwners.findFirst({
    where: eq(lower(initialOwnersDb.publicKey), publicKey.toLowerCase()),
  });
}

export function getInitialOwnerByCredentialIdDb(credentialId: string) {
  return db.query.initialOwners.findFirst({
    where: eq(initialOwnersDb.credentialId, credentialId),
  });
}

export function getInitialOwnerBySmartContractAddressdDb(
  smartContractAddress: Address,
) {
  return db.query.initialOwners.findFirst({
    where: eq(
      lower(initialOwnersDb.smartContractAddress),
      smartContractAddress.toLowerCase(),
    ),
  });
}
