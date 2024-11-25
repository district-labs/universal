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
  }: {
    address: Hex;
  },
) {
  const res = await delegationsApiClient.delegations.delegator[':address'].$get(
    {
      param: { address },
    },
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegationByDelegator(input: {
  address: Hex;
}) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegations-get-by-delegator-and-type', input],
    queryFn: () => getDelegationByDelegator(delegationsApiClient, input),
    enabled: !!delegationsApiClient,
  });
}
