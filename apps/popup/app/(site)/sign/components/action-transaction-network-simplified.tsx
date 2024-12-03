import IconEthereum from '@/components/icon-ethereum';
import { useMessageContext } from '@/lib/state/use-message-context';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { isL2Chain, isValidChain } from 'universal-data';

type ActionTransactionNetworkSimplified = React.HTMLAttributes<HTMLElement>;

export const ActionTransactionNetworkSimplified = ({
  className,
}: ActionTransactionNetworkSimplified) => {
  const { message } = useMessageContext();

  const { validChain, l2Chain } = useMemo(() => {
    if (!message?.chainId) {
      return {
        validChain: false,
        l2Chain: false,
      };
    }

    return {
      validChain: isValidChain(message.chainId),
      l2Chain: isL2Chain(message.chainId),
    };
  }, [message]);

  if (!validChain) return null;

  return (
    <div className={cn('flex items-center gap-x-1', className)}>
      <IconEthereum size={18} />
      {l2Chain && 'Ethereum L2'}{' '}
    </div>
  );
};
