import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWalletKitClient } from './use-wallet-kit-client';
import { getSdkError } from '@walletconnect/utils';

export function useDisconnectWc() {
  const { data: walletKitClient } = useWalletKitClient();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['wc-disconnect'],
    mutationFn: async ({ topic }: { topic: string }) => {
      if (!walletKitClient) {
        return null;
      }
      await walletKitClient.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      await queryClient.invalidateQueries({
        queryKey: ['wc-active-connections'],
      });
    },
  });

  return {
    disconnectWc: walletKitClient ? mutate : undefined,
    disconnectWcAsync: walletKitClient ? mutateAsync : undefined,
    ...rest,
  };
}
