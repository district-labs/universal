import { useMutation } from '@tanstack/react-query';
import { walletKitClient } from '../client';

export function useConnectWc() {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['wc', 'connect'],
    mutationFn: async ({
      uri,
      onPair,
    }: { uri: string | undefined; onPair?: () => Promise<void> }) => {
      if (!uri) { return null; }

      console.log('pairing with uri: ', uri);
      await walletKitClient.pair({ uri });
      console.log('After pairing ');
      await onPair?.();
      console.log('After onpair ');
    },
  });

  return {
    connectWc: mutate,
    connectWcAsync: mutateAsync,
    ...rest,
  };
}
