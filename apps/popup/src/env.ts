import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_PIMLICO_API_KEY: z.string(),
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
    NEXT_PUBLIC_UNIVERSAL_API_URL: z
      .string()
      .url()
      .default('http://localhost:4200'),
    // RPC URLs
    NEXT_PUBLIC_RPC_URL_BASE: z.string().url().optional(),
    NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA: z.string().url().optional(),
    NEXT_PUBLIC_RPC_URL_MAINNET: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_PIMLICO_API_KEY: process.env.NEXT_PUBLIC_PIMLICO_API_KEY,
    NEXT_PUBLIC_CREDENTIALS_API_URL:
      process.env.NEXT_PUBLIC_CREDENTIALS_API_URL,
    NEXT_PUBLIC_DELEGATIONS_API_URL:
      process.env.NEXT_PUBLIC_DELEGATIONS_API_URL,
    NEXT_PUBLIC_IDENTITY_API_URL: process.env.NEXT_PUBLIC_IDENTITY_API_URL,
    NEXT_PUBLIC_UNIVERSAL_API_URL: process.env.NEXT_PUBLIC_UNIVERSAL_API_URL,
    NEXT_PUBLIC_RPC_URL_BASE: process.env.NEXT_PUBLIC_RPC_URL_BASE,
    NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA:
      process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA,
    NEXT_PUBLIC_RPC_URL_MAINNET: process.env.NEXT_PUBLIC_RPC,
  },
});
