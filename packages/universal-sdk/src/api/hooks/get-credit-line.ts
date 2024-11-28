import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import type { Address } from 'viem';
import { useUniversal } from '../client.js';

type GetCreditLineArgs = {
  redeemer: Address;
};

export async function getCreditLine(
  universalApiClient: UniversalApiClient,
  args: GetCreditLineArgs,
) {
  const res = await universalApiClient['credit-line'][':redeemer'].$get({
    param: {
      redeemer: args.redeemer,
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();
  return data;
}

export function useGetCreditLine(params: Partial<GetCreditLineArgs>) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['credit-line-get', params],
    queryFn: () => {
      if (!params.redeemer) {
        return null;
      }

      return getCreditLine(universalApiClient, {
        redeemer: params.redeemer,
      });
    },
    enabled: Boolean(!!universalApiClient && !!params.redeemer),
  });
}
