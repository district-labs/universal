import { type Hex } from 'viem';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    COVALENT_API_KEY: z.string().default(''),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3001'),
    NEXT_PUBLIC_DELEGATIONS_API_URL: z.string().url().default('http://localhost:8787'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_DELEGATIONS_API_URL: process.env.NEXT_PUBLIC_DELEGATIONS_API_URL,
    COVALENT_API_KEY: process.env.COVALENT_API_KEY,
  },
});
