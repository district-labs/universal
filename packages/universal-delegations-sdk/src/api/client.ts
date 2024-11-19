import { hc } from 'hono/client';
import type { AppRouter } from 'api-delegations';

export type DelegationsApiClient = ReturnType<typeof hc<AppRouter>>;

export function getDelegationsApiClient(url: string) {
  return hc<AppRouter>(url);
}

