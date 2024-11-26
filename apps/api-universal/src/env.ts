import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  server: {
    UNIVERSAL_DATABASE_URL: z.string().url().default('http://localhost:4200/'),
    CREDENTIALS_API_URL: z.string().url().default('http://localhost:3100/'),
    DELEGATIONS_API_URL: z.string().url().default('http://localhost:3200/'),
    IDENTITY_API_URL: z.string().url().default('http://localhost:3300/'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
