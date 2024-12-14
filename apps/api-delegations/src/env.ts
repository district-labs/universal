import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import 'dotenv/config';
import { isHex } from 'viem';

export const env = createEnv({
  server: {
    DELEGATIONS_DATABASE_URL: z.string().url(),
    RESOLVER_PRIVATE_KEY: z.string().refine(isHex),
    RPC_URL_BASE: z.string().url(),
    RPC_URL_BASE_SEPOLIA: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
