import { useMutation } from '@tanstack/react-query';
import { useDelegationsApiClient, type DelegationsApiClient } from '../client.js';

type InsertDelegationParams = Parameters<
  DelegationsApiClient['delegations']['$post']
>[0]['json'];

export async function insertDelegation(delegationsApiClient:DelegationsApiClient, data: InsertDelegationParams) {


  const res = await delegationsApiClient.delegations.$post({
    json: data,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;
}

export function useInsertDelegation() {
  const delegationsApiClient = useDelegationsApiClient();
  return useMutation({
    mutationFn: (data: InsertDelegationParams) => insertDelegation(delegationsApiClient, data),
  });
}
