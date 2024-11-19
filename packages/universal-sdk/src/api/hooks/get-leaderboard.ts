import { useQuery } from '@tanstack/react-query';
import type {
  LeaderboardSearchParams,
  UniversalApiClient,
} from 'api-universal';
import { useUniversal } from '../client.js';

export async function getLeaderboard(
  universalApiClient: UniversalApiClient,
  query: LeaderboardSearchParams,
) {
  const res = await universalApiClient.leaderboard.$get({
    query: query,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const { accounts } = await res.json();
  return accounts;
}

export function useGetLeaderboard(params: LeaderboardSearchParams) {
  const universalApiClient = useUniversal();
  return useQuery({
    queryKey: ['leaderboard-get', params],
    queryFn: () => getLeaderboard(universalApiClient, params),
    enabled: !!(!!universalApiClient && !!params.asset && !!params.chainId),
  });
}
