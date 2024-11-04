import { chains } from '@/constants';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useMemo } from 'react';

export function useGetMessageChainId() {
    const { message } = useMessageContext();
    return useMemo(
        () => chains.find(({ id }) => message?.chainId === id),
        [message],
    );
}