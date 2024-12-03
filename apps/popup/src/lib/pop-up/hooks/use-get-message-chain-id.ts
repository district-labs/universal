import { validChains } from 'universal-data';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useMemo } from 'react';

export function useGetMessageChainId() {
  const { message } = useMessageContext();
  return useMemo(
    () => validChains.find(({ id }) => message?.chainId === id),
    [message],
  );
}
