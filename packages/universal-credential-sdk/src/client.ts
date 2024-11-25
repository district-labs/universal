import type { CredentialsApi } from 'api-credentials';
import { hc } from 'hono/client';

export type GetApiCredentialsReturnType = ReturnType<typeof hc<CredentialsApi>>;

export function getApiCredentialsClient(url: string) {
  return hc<CredentialsApi>(url);
}
