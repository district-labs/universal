import { useMessageContext } from '@/lib/state/use-message-context';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { validChains } from 'universal-data';

type ActionTransactionNetwork = React.HTMLAttributes<HTMLElement>;

export const ActionTransactionNetwork = ({
  className,
}: ActionTransactionNetwork) => {
  const { message } = useMessageContext();
  const chain = useMemo(
    () => validChains.find(({ id }) => message?.chainId === id),
    [message],
  );
  return <div className={cn(className)}>Ethereum | {chain?.name}</div>;
};
