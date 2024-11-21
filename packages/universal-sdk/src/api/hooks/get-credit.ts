import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import type { Address } from 'viem';
import { useUniversal } from '../client.js';

export async function getCredit(
  universalApiClient: UniversalApiClient,
  query: {
    address: Address;
  },
) {
  const res = await universalApiClient.credit.delegate[':address'].$post({
    param: {
      address: query.address,
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { credit } = await res.json();
  return credit;
}

export function useGetCredit(params: {
  address: Address;
}) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['credit-get', params],
    queryFn: () => getCredit(universalApiClient, params),
    enabled: !!(!!universalApiClient && !!params.address),
  });
}
