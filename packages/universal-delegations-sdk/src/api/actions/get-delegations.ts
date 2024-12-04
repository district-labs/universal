import { useQuery } from '@tanstack/react-query';
import {
  type DelegationsApiClient,
  useDelegationsApiClient,
} from '../client.js';

type GetDelegationsParams = Parameters<
  DelegationsApiClient['delegations']['get']['$post']
>[0]['json'];

export async function getDelegations(
  delegationsApiClient: DelegationsApiClient,
  params: GetDelegationsParams,
) {
  const res = await delegationsApiClient.delegations.get.$post({
    json: params,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegations } = await res.json();
  return delegations;
}

export function useGetDelegations(params: GetDelegationsParams) {
  const delegationsApiClient = useDelegationsApiClient();
  return useQuery({
    queryKey: ['delegations-get', params],
    queryFn: () => getDelegations(delegationsApiClient, params),
    enabled: !!delegationsApiClient,
  });
}
