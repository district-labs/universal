import type * as React from 'react';
import { cn } from '@/lib/utils';
import { ConnectButton } from '../onchain/connect-button';
import { useAccount } from 'wagmi';

type ViewPageConnectWallet = React.HTMLAttributes<HTMLElement>;

const ViewPageConnectWallet = ({
  children,
  className,
}: ViewPageConnectWallet) => {
  const { address } = useAccount();

  if (!address)
    return (
      <div className={cn(className)}>
        <ConnectButton size="lg" rounded={'full'}>
          Connect Wallet
        </ConnectButton>
      </div>
    );

  return <>{children}</>;
};
export type { ViewPageConnectWallet };
