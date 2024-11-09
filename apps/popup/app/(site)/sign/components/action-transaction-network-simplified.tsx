import IconEthereum from '@/components/icon-ethereum';
import { chains } from '@/constants';
import { useMessageContext } from '@/lib/state/use-message-context';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { base, baseSepolia } from 'viem/chains';

type ActionTransactionNetworkSimplified = React.HTMLAttributes<HTMLElement>;

export const ActionTransactionNetworkSimplified = ({
  className,
}: ActionTransactionNetworkSimplified) => {
  const { message } = useMessageContext();
  const chain = useMemo(
    () => chains.find(({ id }) => message?.chainId === id),
    [message],
  );

  if (!chain) return null;
  return (
    <div className={cn('flex items-center gap-x-1', className)}>
      <IconEthereum size={18} />
      {[base.id, baseSepolia.id].includes(chain?.id) && 'Ethereum L2'}{' '}
    </div>
  );
};
