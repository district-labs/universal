'use client';
import { cn } from '@/lib/utils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type * as React from 'react';
import { Button } from '../ui/button';

export type ConnectSmartWalletButton = React.HTMLAttributes<HTMLElement>;

export const ConnectSmartWalletButton = ({
  children,
  className,
}: ConnectSmartWalletButton) => {
  const { openConnectModal } = useConnectModal();
  return (
    <Button
      type="button"
      size={'lg'}
      className={cn('rounded-full', className)}
      onClick={openConnectModal}
    >
      {children}
    </Button>
  );
};
