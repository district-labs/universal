import { useMessageContext } from '@/lib/state/use-message-context';
import { useMemo } from 'react';
import { getBundlerClient } from '../client/bundler-client';

export type UseBundlerClientReturnType =
  | ReturnType<typeof useBundlerClient>
  | undefined;

export function useBundlerClient() {
  const { message } = useMessageContext();

  return useMemo(() => {
    if (!message) {
      return;
    }
    return getBundlerClient({ chainId: message?.chainId });
  }, [message]);
}
