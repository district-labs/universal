import { env } from '@/env';
import { getApiCredentialsClient } from 'universal-credential-sdk';

export const credentialsApiClient = getApiCredentialsClient(
  env.NEXT_PUBLIC_CREDENTIALS_API_URL,
);
