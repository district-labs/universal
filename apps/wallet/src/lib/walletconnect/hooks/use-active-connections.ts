import { useQuery } from '@tanstack/react-query';
import { walletKitClient } from '../client';

export function useActiveSessions() {
  return useQuery({
    queryKey: ['wc', 'active-connections'],
    queryFn: () => walletKitClient.getActiveSessions(),
  });
}
