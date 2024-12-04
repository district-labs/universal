import { useQuery } from '@tanstack/react-query';
import {
  type DelegationsApiClient,
  useDelegationsApiClient,
} from '../client.js';

type GetDelegationParams = Parameters<
  DelegationsApiClient['delegations'][':hash']['$get']
>[0]['param'];

export async function getDelegation(
  delegationsApiClient: DelegationsApiClient,
  param: GetDelegationParams,
) {
  const res = await delegationsApiClient.delegations[':hash'].$get({
    param,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;
}

export function useGetDelegation(param: GetDelegationParams) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegation-get', param],
    queryFn: () => getDelegation(delegationsApiClient, param),
    enabled: !!delegationsApiClient,
  });
}
