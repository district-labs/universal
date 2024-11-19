import { useMutation } from '@tanstack/react-query';
import type { DelegationsApiClient } from '../client.js';

type InsertDelegationParams = Parameters<
  DelegationsApiClient['delegations']['$post']
>[0]['json'];


export async function insertDelegation(delegationsApiClient: DelegationsApiClient, data: InsertDelegationParams) {

  const format = JSON.parse(JSON.stringify(data, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));

  const res = await delegationsApiClient.delegations.$post({
    json: format,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;

}

export function useInsertDelegation(delegationsApiClient: DelegationsApiClient) {
  return useMutation({
    mutationFn: (data: InsertDelegationParams) => insertDelegation(delegationsApiClient, data),
  });
}
