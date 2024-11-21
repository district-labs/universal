import { useQuery } from '@tanstack/react-query';
import { createWalletKitClient } from '../client';

export function useWalletKitClient() {
  return useQuery({
    queryKey: ['wc', 'create-client'],
    queryFn: () => createWalletKitClient(),
    refetchOnWindowFocus: false,
  });
}
