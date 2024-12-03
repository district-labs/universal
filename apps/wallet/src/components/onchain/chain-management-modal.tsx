'use client';

import { ConnectButton as ConnectButtonRainbowkit } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { Button } from '../ui/button';

export const ChainManagementModal = () => {
  return (
    <ConnectButtonRainbowkit.Custom>
      {({ chain, openChainModal }) => {
        if (!chain?.iconUrl) {
          return (
            <Button
              type="button"
              variant={'outline'}
              size={'sm'}
              onClick={openChainModal}
            >
              {' '}
              <span className="text-2xs">Select Network</span>{' '}
            </Button>
          );
        }

        return (
          <Button
            type="button"
            variant={'outline'}
            size={'sm'}
            onClick={openChainModal}
          >
            <Image
              alt={chain?.name ?? 'Chain Icon'}
              width={16}
              height={16}
              src={chain?.iconUrl as string}
              className="mx-0"
            />
            <span className="text-2xs">L2</span>
          </Button>
        );
      }}
    </ConnectButtonRainbowkit.Custom>
  );
};
