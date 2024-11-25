import {
  getInitialOwnerByCredentialIdDb,
  getInitialOwnerByPublicKeyDb,
  getInitialOwnerBySmartContractAddressdDb,
} from '@/lib/db/actions/get-initial-owner-db';
import type { SelectInitialOwner } from '@/lib/db/schema';
import type { Hex } from 'viem';

export async function GET(
  request: Request,
  { params: { param } }: { params: { param: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let initialOwner: SelectInitialOwner | undefined;

    if (!search || search === 'publicKey') {
      initialOwner = await getInitialOwnerByPublicKeyDb(param as Hex);
    }

    if (search === 'credentialId') {
      initialOwner = await getInitialOwnerByCredentialIdDb(param);
    }

    if (search === 'smartContractAddress') {
      initialOwner = await getInitialOwnerBySmartContractAddressdDb(
        param as Hex,
      );
    }
    if (!initialOwner) {
      return new Response('Initial owner not found', { status: 404 });
    }

    return new Response(JSON.stringify(initialOwner, null, 2), { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return new Response(errorMessage, { status: 500 });
  }
}
