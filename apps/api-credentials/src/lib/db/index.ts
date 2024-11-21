import { env } from '../../env.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// biome-ignore lint/style/noNamespaceImport: Needed for drizzle
import * as schema from './schema.js';

const client = postgres(env.CREDENTIALS_DB_URL);
export const db = drizzle(client, { schema });
