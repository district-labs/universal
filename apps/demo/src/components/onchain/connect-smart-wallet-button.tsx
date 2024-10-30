'use client';

import * as React from 'react';
import { useConnect } from 'wagmi';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type ConnectSmartWalletButton = React.HTMLAttributes<HTMLElement>;

const ConnectSmartWalletButton = ({
  children,
  className,
}: ConnectSmartWalletButton) => {
  const { connectors, connect } = useConnect();

  const createWallet = React.useCallback(() => {
    const universalWalletConnector = connectors.find(
      (connector) => connector.id === 'universalWalletSDK',
    );

    if (universalWalletConnector) {
      connect({ connector: universalWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <Button
      type="button"
      size={'lg'}
      className={cn('rounded-full', className)}
      onClick={createWallet}
    >
      {children}
    </Button>
  );
};
export { ConnectSmartWalletButton };
