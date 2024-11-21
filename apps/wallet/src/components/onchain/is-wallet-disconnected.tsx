'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export interface IsWalletDisconnectedProps {
  children: ReactNode;
}

export const IsWalletDisconnected = ({
  children,
}: IsWalletDisconnectedProps) => {
  const { address } = useAccount();

  const [isMounted, setIsMounted] = useState<boolean>();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!address) {
    return <>{children}</>;
  }

  return null;
};
