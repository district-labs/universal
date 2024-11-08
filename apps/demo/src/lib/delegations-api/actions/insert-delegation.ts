import { delegationsAPiClient } from '../client';

type InsertDelegationParams = Parameters<
  typeof delegationsAPiClient.delegations.$post
>[0]['json'];

export async function insertDelegation(params: InsertDelegationParams) {
  const res = await delegationsAPiClient.delegations.$post({
    json: params,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { delegation } = await res.json();
  return delegation;
}
