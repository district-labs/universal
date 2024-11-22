import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import type { Address } from 'viem';
import { useUniversal } from '../client.js';

type GetCreditArgs = {
  address: Address;
  chainId: number;
  type?: string;
};

export async function getCredit(
  universalApiClient: UniversalApiClient,
  args: GetCreditArgs,
) {
  const res = await universalApiClient.credit.delegate[':address'].$post({
    param: {
      address: args.address,
    },
    json: {
      chainId: args.chainId,
      type: args?.type || 'DebitAuthorization',
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();
  return data;
}

export function useGetCredit(params: GetCreditArgs) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['credit-get', params],
    queryFn: () => getCredit(universalApiClient, params),
    enabled: !!(!!universalApiClient && !!params.address && !!params.chainId),
  });
}
