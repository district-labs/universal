import type { Hex } from 'viem';
import { delegationsAPiClient } from '../client';

export async function invalidateDelegation(hash: Hex) {
  const res = await delegationsAPiClient.delegations.invalidate[':hash'].$patch(
    {
      param: { hash },
    },
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }
}
