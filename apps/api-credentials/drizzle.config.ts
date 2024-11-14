import type { Config } from 'drizzle-kit';

if (!process.env.CREDENTIALS_DB_URL) {
  throw new Error('CREDENTIALS_DB_URL is not set');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.CREDENTIALS_DB_URL,
  },
} satisfies Config;
