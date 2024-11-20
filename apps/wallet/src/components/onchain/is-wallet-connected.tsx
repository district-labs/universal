'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

type IsWalletConnectedProps = React.HTMLAttributes<HTMLElement>;

export const IsWalletConnected = ({ children }: IsWalletConnectedProps) => {
  const { address } = useAccount();

  const [isMounted, setIsMounted] = useState<boolean>();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (address) {
    return <>{children}</>;
  }

  return null;
};
