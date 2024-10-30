import { insertInitialOwnerDb } from '@/lib/db/actions/insert-initial-owner-db';
import { z } from 'zod';

const insertInitialOwnersSchema = z.object({
  credentialId: z.string(),
  publicKey: z.string(),
  smartContractAddress: z.string(),
});

export type InsertInitialOwners = z.infer<typeof insertInitialOwnersSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = insertInitialOwnersSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Invalid request body',
        }),
        { status: 400 },
      );
    }

    const initialOwner = await insertInitialOwnerDb(parsedBody.data);

    return new Response(JSON.stringify(initialOwner, null, 2), { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return new Response(errorMessage, { status: 500 });
  }
}
