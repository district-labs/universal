import type { Hex } from 'viem';
import { useQuery } from '@tanstack/react-query';
import type { DelegationsApiClient } from '../client.js';

export async function getDelegationByDelegatorAndType(delegationsApiClient: DelegationsApiClient, {
  address,
  type
}: {
  address: Hex
  type: string
}) {

  const res = await delegationsApiClient.delegations.delegator[':address'][":type"].$get({
    param: { address, type },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegatorAndType(delegationsApiClient: DelegationsApiClient, input: {
  address: Hex
  type: string
}) {
  return useQuery({
    queryKey: ['delegations-get-by-delegator-and-type', input],
    queryFn: () => getDelegationByDelegatorAndType(delegationsApiClient, input),
  });
}
