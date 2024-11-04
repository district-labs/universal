import { hc } from "hono/client";
import type { AppRouter } from "delegations-api";

export const delegationsAPiClient = hc<AppRouter>("http://localhost:8787/");
