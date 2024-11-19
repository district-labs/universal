import { useMutation } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import { useUniversal } from '../client.js';

type InsertParams = Parameters<
  UniversalApiClient['accounts']['$post']
>[0]['json'];

export async function insertAccount(
  delegationsApiClient: UniversalApiClient,
  data: InsertParams,
) {
  try {
    const res = await delegationsApiClient.accounts.$post({
      json: data,
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }

    const { data: _data } = await res.json();
    return _data;
  } catch (error) {
    throw error;
  }
}

export function useInsertAccount() {
  const client = useUniversal();
  return useMutation({
    mutationFn: (data: InsertParams) => insertAccount(client, data),
  });
}
