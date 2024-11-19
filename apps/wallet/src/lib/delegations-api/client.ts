import { getDelegationsApiClient } from 'universal-delegations-sdk';
import { env } from '@/env';

export const delegationsApiClient = getDelegationsApiClient(
  env.NEXT_PUBLIC_DELEGATIONS_API_URL,
);
