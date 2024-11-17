import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useAccount } from 'wagmi';

type ConnectedWalletName = React.HTMLAttributes<HTMLElement>;

const ConnectedWalletName = ({ className }: ConnectedWalletName) => {
  const { connector } = useAccount();
  if (!connector) {
    return null;
  }
  return <span className={cn(className)}>{connector?.name}</span>;
};
export { ConnectedWalletName };
