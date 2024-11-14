'use client';
import { useAccount } from 'wagmi';

type IsWalletConnectedProps = React.HTMLAttributes<HTMLElement>;

export const IsWalletConnected = ({ children }: IsWalletConnectedProps) => {
  const { address } = useAccount();

  if (address) {
    return <>{children}</>;
  }

  return null;
};
