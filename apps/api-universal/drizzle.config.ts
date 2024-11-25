import type { Config } from 'drizzle-kit';

// Not using t3-env since the drizzle-kit CLI needs to resolve the .js file
if (!process.env.UNIVERSAL_DATABASE_URL) {
  throw new Error('UNIVERSAL_DATABASE_URL is required');
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.UNIVERSAL_DATABASE_URL,
  },
} satisfies Config;
