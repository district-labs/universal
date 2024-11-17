'use client';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';
import { useDisconnect } from 'wagmi';

type DisconnectWalletElement = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export const DisconnectWalletElement = ({
  children,
  className,
  asChild,
}: DisconnectWalletElement) => {
  const { disconnect } = useDisconnect();
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      onClick={() => disconnect()}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </Comp>
  );
};
