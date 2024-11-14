import { hc } from "hono/client"
import type { AppType } from "api-credentials"

export const apiCredentialsClient = hc<AppType>('http://localhost:8787/')
