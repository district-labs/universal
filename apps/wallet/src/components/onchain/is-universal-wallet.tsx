'use client';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useAccount } from 'wagmi';

export type IsUniversalWallet = React.HTMLAttributes<HTMLElement>;

export const IsUniversalWallet = ({
  children,
  className,
}: IsUniversalWallet) => {
  const { connector } = useAccount();
  if (!connector || connector.type !== 'universalWallet') {
    return null;
  }

  return <div className={cn(className)}>{children}</div>;
};
