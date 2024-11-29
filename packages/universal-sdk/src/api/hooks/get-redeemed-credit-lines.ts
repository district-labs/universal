import { useQuery } from '@tanstack/react-query';
import type { UniversalApiClient } from 'api-universal';
import { useUniversal } from '../client.js';

type GetRedeemedCreditLinesArgs = Parameters<
  UniversalApiClient['credit-line']['redeemed-credit-lines']['$post']
>[0]['json'];

export async function getRedeemedCreditLines(
  universalApiClient: UniversalApiClient,
  args: GetRedeemedCreditLinesArgs,
) {
  const res = await universalApiClient['credit-line'][
    'redeemed-credit-lines'
  ].$post({
    json: args,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();
  return data;
}

export function useGetRedeemedCreditLines(
  params: Partial<GetRedeemedCreditLinesArgs>,
) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['get-redeemed-credit-lines', params],
    queryFn: () => {
      const { delegate, delegator } = params;
      // One of delegate or delegator must be provided
      if (!delegate && !delegator) {
        return null;
      }

      return getRedeemedCreditLines(universalApiClient, {
        delegate,
        delegator,
      } as GetRedeemedCreditLinesArgs);
    },
    enabled: Boolean(
      !!universalApiClient && !!(params.delegate || params.delegator),
    ),
  });
}
