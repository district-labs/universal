import { chains } from '@/constants';
import { useMessageContext } from '@/lib/state/use-message-context';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type ActionTransactionNetwork = React.HTMLAttributes<HTMLElement>;

export const ActionTransactionNetwork = ({
  className,
}: ActionTransactionNetwork) => {
  const { message } = useMessageContext();
  const chain = useMemo(
    () => chains.find(({ id }) => message?.chainId === id),
    [message],
  );
  return <div className={cn(className)}>{chain?.name}</div>;
};
