import { useQuery } from '@tanstack/react-query';
import { useWalletKitClient } from './use-wallet-kit-client';

export function useActiveSessions(
  {
    enabled,
  }: {
    enabled?: boolean;
  } = { enabled: true },
) {
  const { data: walletKitClient } = useWalletKitClient();
  return useQuery({
    queryKey: ['wc', 'active-connections'],
    queryFn: async () => {
      if (!walletKitClient) return null;
      return walletKitClient.getActiveSessions();
    },
    enabled: enabled && !!walletKitClient,
  });
}
