import type { IdentityApi } from 'api-identity';
import type { hc } from 'hono/client';

export type UniversalIdentityApiClient = ReturnType<typeof hc<IdentityApi>>;

export type UniversalDID = {
  document: string;
};

export type VerificationRequest = {
  id: string;
  type: string;
};
