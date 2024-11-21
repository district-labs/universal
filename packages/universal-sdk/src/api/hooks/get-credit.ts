import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import type { Address } from 'viem';
import { useUniversal } from '../client.js';

export async function getCredit(
  universalApiClient: UniversalApiClient,
  query: {
    address: Address;
    chainId: number;
  },
) {
  const res = await universalApiClient.credit.delegate[':address'].$post({
    param: {
      address: query.address,
    },
    json: {
      chainId: query.chainId,
      type: 'DebitAuthorization',
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();
  return data;
}

export function useGetCredit(params: {
  address: Address;
  chainId: number;
}) {
  const universalApiClient = useUniversal();
  console.log(params, 'paramsparams');
  return useQuery({
    queryKey: ['credit-get', params],
    queryFn: () => getCredit(universalApiClient, params),
    enabled: !!(!!universalApiClient && !!params.address && !!params.chainId),
  });
}
