import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWalletKitClient } from './use-wallet-kit-client';
import { getSdkError } from '@walletconnect/utils';
import type { IWalletKit } from '@reown/walletkit';

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
      // Add optimistic update removing the session from the active connections list
      await queryClient.setQueryData(
        ['wc-active-connections'],
        (sessions: ReturnType<IWalletKit['getActiveSessions']>) =>
          Object.fromEntries(
            Object.entries(sessions).filter(([key]) => key !== topic),
          ),
      );
    },
  });

  return {
    disconnectWc: walletKitClient ? mutate : undefined,
    disconnectWcAsync: walletKitClient ? mutateAsync : undefined,
    ...rest,
  };
}
