'use client';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useAccount } from 'wagmi';

export type IsNotUniversalWallet = React.HTMLAttributes<HTMLElement>;

export const IsNotUniversalWallet = ({
  children,
  className,
}: IsNotUniversalWallet) => {
  const { connector } = useAccount();
  if (connector?.type === 'universalWallet') {
    return null;
  }

  return <div className={cn(className)}>{children}</div>;
};
