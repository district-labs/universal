import type { CredentialsApi } from 'api-credentials';
import { hc } from 'hono/client';

const apiCredentialsUrl =
  process.env.NEXT_PUBLIC_CREDENTIALS_API_URL ?? 'http://localhost:3100/';

export const apiCredentialsClient = hc<CredentialsApi>(apiCredentialsUrl);
