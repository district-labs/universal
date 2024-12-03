import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
  type DelegationsApiClient,
  useDelegationsApiClient,
} from '../client.js';

export async function getDelegationByDelegate(
  delegationsApiClient: DelegationsApiClient,
  {
    address,
    chainId,
  }: {
    address: Hex;
    chainId: number;
  },
) {
  const res = await delegationsApiClient.delegations.delegate[':chainId'][
    ':address'
  ].$get({
    param: { address, chainId: chainId.toString() },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegate(input: {
  address: Hex;
  chainId: number;
}) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegations-get-by-delegate-and-type', input],
    queryFn: () => getDelegationByDelegate(delegationsApiClient, input),
    enabled: !!delegationsApiClient,
  });
}
