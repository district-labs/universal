import type { CredentialsApi } from 'universal-credentials-sdk';
import type { DelegationsApi } from 'api-delegations';
import type { IdentityApi } from 'api-identity';
import { hc } from 'hono/client';
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
