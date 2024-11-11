'use client';
import type * as React from 'react';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';

type IsNotUniversalWallet = React.HTMLAttributes<HTMLElement>;

const IsNotUniversalWallet = ({
  children,
  className,
}: IsNotUniversalWallet) => {
  const { connector } = useAccount();
  if (connector?.type === 'universalWallet') return null;

  return <div className={cn(className)}>{children}</div>;
};
export type { IsNotUniversalWallet };
