import { DataSource } from 'typeorm';
import { Entities, migrations } from '@veramo/data-store';
import 'dotenv/config';

if (!process.env.KEYSTORE_DB_URL) {
  throw new Error('KEYSTORE_DB_URL env var is required');
}

export const dbConnection = new DataSource({
  type: 'postgres',
  url: process.env.KEYSTORE_DB_URL,
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize();
