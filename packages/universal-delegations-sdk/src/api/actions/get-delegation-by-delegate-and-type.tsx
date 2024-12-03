import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
  type DelegationsApiClient,
  useDelegationsApiClient,
} from '../client.js';

export async function getDelegationByDelegateAndType(
  delegationsApiClient: DelegationsApiClient,
  {
    address,
    chainId,
    type,
  }: {
    address: Hex;
    chainId: number;
    type: string;
  },
) {
  const res = await delegationsApiClient.delegations.delegate[':address'][
    ':type'
  ].$get({
    param: { address, chainId: chainId.toString(), type },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegateAndType(input: {
  address: Hex;
  chainId: number;
  type: string;
}) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegations-get-by-delegate-and-type', input],
    queryFn: () => getDelegationByDelegateAndType(delegationsApiClient, input),
    enabled: !!delegationsApiClient,
  });
}
