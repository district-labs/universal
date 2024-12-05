import type { Config } from 'drizzle-kit';
import { env } from './src/env';

export default {
  out: './src/lib/db/drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
