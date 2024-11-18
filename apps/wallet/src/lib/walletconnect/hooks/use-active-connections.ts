import { useQuery } from '@tanstack/react-query';
import { walletKitClient } from '../client';

export function useActiveSessions(
  {
    enabled,
  }: {
    enabled?: boolean;
  } = { enabled: true },
) {
  return useQuery({
    queryKey: ['wc', 'active-connections'],
    queryFn: () => walletKitClient.getActiveSessions(),
    enabled,
  });
}
