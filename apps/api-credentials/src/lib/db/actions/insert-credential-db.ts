import { db } from '../index.js';
import {
  type InsertCredentialDb,
  credentials as credentialsDb,
} from '../schema.js';

type InsertCredentialDbParams = Omit<InsertCredentialDb, 'id'>;

export function insertCredentialDb(params: InsertCredentialDbParams) {
  return db.insert(credentialsDb).values(params);
}
