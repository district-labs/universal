import type { CredentialsApi } from 'api-credentials';
import type { DelegationsApi } from 'api-delegations';
import type { IdentityApi } from 'api-identity';
import { hc } from 'hono/client';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const apiCredentialsUrl =
  process.env.CREDENTIALS_API_URL ?? 'http://localhost:3100/';
const apiDelegationsUrl =
  process.env.CREDENTIALS_API_URL ?? 'http://localhost:3200/';
const apiIdentityUrl =
  process.env.CREDENTIALS_API_URL ?? 'http://localhost:3300/';

export const apiCredentialsClient = hc<CredentialsApi>(apiCredentialsUrl);
export const apiDelegationsClient = hc<DelegationsApi>(apiDelegationsUrl);
export const apiIdentityClient = hc<IdentityApi>(apiIdentityUrl);

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
