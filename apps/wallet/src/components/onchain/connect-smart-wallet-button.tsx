'use client';

import type * as React from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type ConnectSmartWalletButton = React.HTMLAttributes<HTMLElement>;

const ConnectSmartWalletButton = ({
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
export type { ConnectSmartWalletButton };
