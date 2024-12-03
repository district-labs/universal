import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
  type DelegationsApiClient,
  useDelegationsApiClient,
} from '../client.js';

export async function getDelegationByDelegator(
  delegationsApiClient: DelegationsApiClient,
  {
    address,
    chainId,
  }: {
    address: Hex;
    chainId: number;
  },
) {
  const res = await delegationsApiClient.delegations.delegator[':chainId'][
    ':address'
  ].$get({
    param: {
      address,
      chainId: chainId.toString(),
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegator(input: {
  address: Hex;
  chainId: number;
}) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegations-get-by-delegator-and-type', input],
    queryFn: () => getDelegationByDelegator(delegationsApiClient, input),
    enabled: !!delegationsApiClient,
  });
}
