import { env } from '@/env';
import { getIdentityApiClient } from 'universal-identity-sdk';

export const identityApiClient = getIdentityApiClient(
  env.NEXT_PUBLIC_IDENTITY_API_URL,
);
