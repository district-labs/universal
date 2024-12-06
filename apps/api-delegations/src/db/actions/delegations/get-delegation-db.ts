import type { DelegationWithMetadata } from 'universal-types';
import type { GetDelegationParams } from '../../../validation.js';
import { db } from '../../index.js';
import { ROOT_AUTHORITY } from 'universal-data';

function addAuthorityDelegationAtLeaf(
  root: DelegationWithMetadata,
  newAuthorityDelegation: DelegationWithMetadata,
): DelegationWithMetadata {
  // If we've reached a leaf where authorityDelegation is null, insert the new delegation here.
  if (root.authorityDelegation === null) {
    return {
      ...root,
      authorityDelegation: newAuthorityDelegation,
    };
  }

  // Otherwise, recurse down one level and update that subtree
  return {
    ...root,
    authorityDelegation: addAuthorityDelegationAtLeaf(
      root.authorityDelegation,
      newAuthorityDelegation,
    ),
  };
}

export async function getDelegationDb({
  hash,
}: GetDelegationParams): Promise<DelegationWithMetadata | undefined> {
  return db.transaction(async (tx) => {
    // Fetch the top-level (initial) delegation
    const topDelegationDb = await tx.query.delegations.findFirst({
      where: (delegations, { eq }) => eq(delegations.hash, hash),
      with: { caveats: true },
    });

    if (!topDelegationDb) {
      return undefined;
    }

    // Initialize our top-level delegation with authorityDelegation = null
    let delegation: DelegationWithMetadata = {
      ...topDelegationDb,
      authorityDelegation: null,
    };

    // If authority is the root authority, no further chaining is needed
    if (delegation.authority === ROOT_AUTHORITY) {
      return delegation;
    }

    // Check for delegation loops
    if (delegation.hash === delegation.authority) {
      throw new Error('Delegation loop detected');
    }

    // Walk down the chain of authority delegations until we hit the root
    let currentAuthority = delegation.authority;

    // TODO: replace loop with query using recursive CTE
    while (currentAuthority !== ROOT_AUTHORITY) {
      const nextDelegationDb = await tx.query.delegations.findFirst({
        where: (delegations, { eq }) => eq(delegations.hash, currentAuthority),
        with: { caveats: true },
      });

      if (!nextDelegationDb) {
        // If we can't find the next delegation in the chain, stop and return what we have so far
        break;
      }

      // Check for delegation loops
      if (nextDelegationDb.hash === nextDelegationDb.authority) {
        throw new Error('Delegation loop detected');
      }

      const nextDelegation: DelegationWithMetadata = {
        ...nextDelegationDb,
        authorityDelegation: null,
      };

      // Insert this delegation at the leaf of our current chain
      delegation = addAuthorityDelegationAtLeaf(delegation, nextDelegation);

      // Move on to the next authority in the chain
      currentAuthority = nextDelegation.authority;
    }

    return delegation;
  });
}
