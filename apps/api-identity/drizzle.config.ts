import { env } from '@/env.js';
import type { Config } from 'drizzle-kit';

export default {
  out: './src/lib/db/drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
