import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    CREDENTIALS_DB_URL: z.string().url(),
    KEYSTORE_DB_URL: z.string().url(),
    DISCORD_OAUTH_CLIENT_ID: z.string().min(1),
    DISCORD_OAUTH_CLIENT_SECRET: z.string().min(1),
    DISCORD_OAUTH_REDIRECT_URI: z.string().url(),
    GITHUB_OAUTH_CLIENT_ID: z.string().min(1),
    GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1),
    GITHUB_OAUTH_REDIRECT_URI: z.string().url(),
    TWITTER_OAUTH_CLIENT_ID: z.string().min(1),
    TWITTER_OAUTH_CLIENT_SECRET: z.string().min(1),
    TWITTER_OAUTH_REDIRECT_URI: z.string().url(),
    DID_PUB_KEY: z.string().length(130),
    KMS_SECRET_KEY: z.string().min(1),
    API_CREDENTIALS_DNS: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
