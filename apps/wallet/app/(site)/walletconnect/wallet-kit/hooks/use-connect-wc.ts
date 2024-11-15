import { useMutation } from '@tanstack/react-query';
import { walletKitClient } from '../client';

export function useConnectWc() {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['wc', 'connect'],
    mutationFn: async ({
      uri,
      onPair,
    }: { uri: string | undefined; onPair?: () => Promise<void> }) => {
      if (!uri || !walletKitClient) return null;

      await walletKitClient.pair({ uri });
      await onPair?.();
    },
  });

  return {
    connectWc: mutate,
    connectWcAsync: mutateAsync,
    ...rest,
  };
}
