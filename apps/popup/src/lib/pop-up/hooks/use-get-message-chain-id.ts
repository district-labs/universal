import { useMessageContext } from '@/lib/state/use-message-context';
import { useMemo } from 'react';
import { validChains } from 'universal-data';

export function useGetMessageChainId() {
  const { message } = useMessageContext();
  return useMemo(
    () => validChains.find(({ id }) => message?.chainId === id),
    [message],
  );
}
