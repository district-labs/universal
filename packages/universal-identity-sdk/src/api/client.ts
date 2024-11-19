import { hc } from "hono/client";
import type { AppRouter } from "api-identity";

export type IdentityApiClient = ReturnType<typeof hc<AppRouter>>;

export function getIdentityApiClient(url: string) {
	return hc<AppRouter>(url);
}
