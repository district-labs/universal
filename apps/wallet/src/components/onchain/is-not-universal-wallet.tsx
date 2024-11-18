'use client';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { universalWalletConnectorId } from 'universal-wallet-connector';
import { useAccount } from 'wagmi';

export type IsNotUniversalWallet = React.HTMLAttributes<HTMLElement>;

export const IsNotUniversalWallet = ({
  children,
  className,
}: IsNotUniversalWallet) => {
  const { connector } = useAccount();
  if (connector?.id === universalWalletConnectorId) {
    return null;
  }

  return <div className={cn(className)}>{children}</div>;
};
