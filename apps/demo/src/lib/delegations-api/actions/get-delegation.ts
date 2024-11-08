import type { Hex } from 'viem';
import { delegationsAPiClient } from '../client';

export async function getDelegation(hash: Hex) {
  const res = await delegationsAPiClient.delegations[':hash'].$get({
    param: { hash },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;
}
