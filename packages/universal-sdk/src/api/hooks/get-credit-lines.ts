import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import { useUniversal } from '../client.js';

type GetCreditLinesArgs = Parameters<
  UniversalApiClient['credit-line']['$post']
>[0]['json'];

export async function getCreditLines(
  universalApiClient: UniversalApiClient,
  args: GetCreditLinesArgs,
) {
  const res = await universalApiClient['credit-line'].$post({
    json: args,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();
  return data;
}

export function useGetCreditLines(params: Partial<GetCreditLinesArgs>) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['get-credit-lines', params],
    queryFn: () => {
      const { delegate, delegator, type, chainId } = params;
      // One of delegate or delegator must be provided
      if (!delegate && !delegator && !chainId) {
        return null;
      }

      return getCreditLines(universalApiClient, {
        delegate,
        delegator,
        type,
        chainId,
      } as GetCreditLinesArgs);
    },
    enabled: Boolean(
      !!universalApiClient &&
        !!(params.delegate || params.delegator) &&
        !!params.chainId,
    ),
  });
}
