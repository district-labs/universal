'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';

type IsUniversalWallet = React.HTMLAttributes<HTMLElement>;

const IsUniversalWallet = ({ children, className }: IsUniversalWallet) => {
  const { connector } = useAccount();
  if (!connector || connector.type != 'universalWallet') return null;

  return <div className={cn(className)}>{children}</div>;
};
export { IsUniversalWallet };
