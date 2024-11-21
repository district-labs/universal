import { Entities, migrations } from '@veramo/data-store';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { env } from '@/env.js';

export const dbConnection = new DataSource({
  type: 'postgres',
  url: env.KEYSTORE_DB_URL,
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize();
