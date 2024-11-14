import { hc } from "hono/client"
import type { AppType } from "api-credentials"

const apiCredentialsUrl = process.env.NEXT_PUBLIC_CREDENTIALS_API_URL ?? 'http://localhost:3100/'

export const apiCredentialsClient = hc<AppType>(apiCredentialsUrl)
