import { hc } from 'hono/client';
import type { CredentialsApi } from 'universal-credential-sdk';
import type { DelegationsApi } from 'universal-delegations-sdk';
import type { IdentityApi } from 'universal-identity-sdk';
import { http, createPublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { env } from './env.js';

export const apiCredentialsClient = hc<CredentialsApi>(env.CREDENTIALS_API_URL);
export const apiDelegationsClient = hc<DelegationsApi>(env.DELEGATIONS_API_URL);
export const apiIdentityClient = hc<IdentityApi>(env.IDENTITY_API_URL);

const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

import type { ValidChain } from 'universal-data';

export function getPublicClient(chainId: ValidChain['id']) {
  switch (chainId) {
    case base.id:
      return basePublicClient;
    case baseSepolia.id:
      return baseSepoliaPublicClient;
    default:
      throw new Error('Invalid chain ID');
  }
}
