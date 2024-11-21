import type { Hex } from 'viem';

import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import { useUniversal } from '../client.js';

export async function getAccount(
  universalApiClient: UniversalApiClient,
  address: Hex,
) {
  const res = await universalApiClient.accounts[':address'].$get({
    param: { address },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { account } = await res.json();
  return account;
}

export function useGetAccount(hash: Hex) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['account-get', hash],
    queryFn: () => getAccount(universalApiClient, hash),
    enabled: !!universalApiClient,
  });
}
