import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3001'),
    NEXT_PUBLIC_CREDENTIALS_API_URL: z
      .string()
      .url()
      .default('http://localhost:3100'),
    NEXT_PUBLIC_DELEGATIONS_API_URL: z
      .string()
      .url()
      .default('http://localhost:3200'),
    NEXT_PUBLIC_IDENTITY_API_URL: z
      .string()
      .url()
      .default('http://localhost:3300'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CREDENTIALS_API_URL:
      process.env.NEXT_PUBLIC_CREDENTIALS_API_URL,
    NEXT_PUBLIC_DELEGATIONS_API_URL:
      process.env.NEXT_PUBLIC_DELEGATIONS_API_URL,
    NEXT_PUBLIC_IDENTITY_API_URL: process.env.NEXT_PUBLIC_IDENTITY_API_URL,
  },
});
