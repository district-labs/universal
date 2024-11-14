import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema.js';

if (!process.env.CREDENTIALS_DB_URL) {
  throw new Error('CREDENTIALS_DB_URL is not set');
}

const client = postgres(process.env.CREDENTIALS_DB_URL);
export const db = drizzle(client, { schema });
