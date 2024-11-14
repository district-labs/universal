import { db } from '../index.js';
import type { SQL } from 'drizzle-orm';

type GetCredentialDbParams = (
  | {
      issuer: string;
      subject?: string;
    }
  | {
      subject: string;
      issuer?: string;
    }
) & {
  category?: string;
  type?: string;
};

export function getCredentialDb(params: GetCredentialDbParams) {
  return db.query.credentials.findMany({
    where: ({ category, issuer, subject, type }, { eq, and }) => {
      const conditions: SQL[] = [];

      if (params.issuer) {
        conditions.push(eq(issuer, params.issuer));
      }

      if (params.subject) {
        conditions.push(eq(subject, params.subject));
      }

      if (params.category) {
        conditions.push(eq(category, params.category));
      }

      if (params.type) {
        conditions.push(eq(type, params.type));
      }

      return and(...conditions);
    },
  });
}
