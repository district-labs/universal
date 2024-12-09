import type { DelegationWithMetadata, Delegation } from 'universal-types';

export function getDelegationBatch(
  delegation: DelegationWithMetadata,
): Delegation[] {
  const delegationBatch: Delegation[] = [];

  let authorityDelegation: DelegationWithMetadata | null = delegation;
  while (authorityDelegation !== null) {
    const { delegate, delegator, authority, caveats, salt, signature } =
      authorityDelegation;
    delegationBatch.push({
      authority,
      caveats,
      delegate,
      delegator,
      salt,
      signature,
    });
    authorityDelegation = authorityDelegation.authorityDelegation;
  }

  return delegationBatch;
}
