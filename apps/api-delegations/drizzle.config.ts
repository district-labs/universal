import type { Config } from 'drizzle-kit';

if (!process.env.DELEGATIONS_DATABASE_URL) {
  throw new Error('DELEGATIONS_DATABASE_URL is not set');
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DELEGATIONS_DATABASE_URL,
  },
} satisfies Config;
