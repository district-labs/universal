import type { DelegationWithMetadata } from 'universal-types';

export type ReplaceAuthKeysParams = Omit<
  DelegationWithMetadata,
  'authorityDelegation'
> & {
  auth: ReplaceAuthKeysParams | null;
};

export function replaceAuthKeys(
  delegation: ReplaceAuthKeysParams,
): DelegationWithMetadata {
  const { auth, ...rest } = delegation;

  return {
    ...rest,
    authorityDelegation: auth ? replaceAuthKeys(auth) : null,
  };
}

export const MAX_DELEGATION_DEPTH = 5;

export type AuthConfig = true | { with: { caveats: true; auth: AuthConfig } };

export function buildAuthConfig(depth: number): AuthConfig {
  if (depth === 0) {
    return true; // at the bottom level, 'auth' is just 'true'
  }
  return {
    with: {
      caveats: true,
      auth: buildAuthConfig(depth - 1),
    },
  };
}
