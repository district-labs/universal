import type { Hex } from 'viem';
import { useQuery } from '@tanstack/react-query';
import type { DelegationsApiClient } from '../client.js';

export async function getDelegationByDelegator(delegationsApiClient: DelegationsApiClient, {
  address
}: {
  address: Hex
}) {

  const res = await delegationsApiClient.delegations.delegator[':address'].$get({
    param: { address },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegator(delegationsApiClient: DelegationsApiClient, input: {
  address: Hex
}) {
  return useQuery({
    queryKey: ['delegations-get-by-delegator-and-type', input],
    queryFn: () => getDelegationByDelegator(delegationsApiClient, input),
  });
}
