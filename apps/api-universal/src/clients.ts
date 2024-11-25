import type { IdentityApi } from 'universal-identity-sdk';
import { hc } from 'hono/client';
import type { CredentialsApi } from 'universal-credential-sdk';
import type { DelegationsApi } from 'universal-delegations-sdk';
import { http, createPublicClient } from 'viem';
import { baseSepolia } from 'viem/chains';
import { env } from './env.js';

export const apiCredentialsClient = hc<CredentialsApi>(env.CREDENTIALS_API_URL);
export const apiDelegationsClient = hc<DelegationsApi>(env.DELEGATIONS_API_URL);
export const apiIdentityClient = hc<IdentityApi>(env.IDENTITY_API_URL);

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
