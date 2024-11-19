import type { Hex } from 'viem';

import { useQuery } from '@tanstack/react-query';
import type { DelegationsApiClient } from '../client.js';

export async function getDelegation(delegationsApiClient: DelegationsApiClient, hash: Hex) {
  const res = await delegationsApiClient.delegations[':hash'].$get({
    param: { hash },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;
}

export function useGetDelegation(delegationsApiClient: DelegationsApiClient, { hash }: { hash: Hex }) {
  return useQuery({
    queryKey: ['delegation-get', hash],
    queryFn: () => getDelegation(delegationsApiClient, hash),
  });
}
