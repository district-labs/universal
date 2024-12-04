import type { Config } from 'drizzle-kit';
import { env } from './src/env';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.CREDENTIALS_DB_URL,
  },
} satisfies Config;
