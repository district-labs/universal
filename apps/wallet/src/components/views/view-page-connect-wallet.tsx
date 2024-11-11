import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '../onchain/connect-button';

export type ViewPageConnectWallet = React.HTMLAttributes<HTMLElement>;

export const ViewPageConnectWallet = ({
  children,
  className,
}: ViewPageConnectWallet) => {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className={cn(className)}>
        <ConnectButton size="lg" rounded={'full'}>
          Connect Wallet
        </ConnectButton>
      </div>
    );
  }

  return <>{children}</>;
};
