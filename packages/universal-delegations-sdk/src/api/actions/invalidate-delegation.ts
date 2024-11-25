import type { Hex } from 'viem';
import type { DelegationsApiClient } from '../client.js';

export async function invalidateDelegation(
  delegationsApiClient: DelegationsApiClient,
  hash: Hex,
) {
  const res = await delegationsApiClient.delegations.invalidate[':hash'].$patch(
    {
      param: { hash },
    },
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }
}
