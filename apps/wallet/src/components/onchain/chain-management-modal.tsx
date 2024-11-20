'use client';

import { ConnectButton as ConnectButtonRainbowkit } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { Button } from '../ui/button';

export const ChainManagementModal = () => {
  return (
    <ConnectButtonRainbowkit.Custom>
      {({ chain, openChainModal }) => {
        if (!chain?.iconUrl) {
          return null;
        }

        return (
          <Button
            type="button"
            variant={'outline'}
            size={'icon'}
            onClick={openChainModal}
          >
            <Image
              alt={chain?.name ?? 'Chain Icon'}
              width={18}
              height={18}
              src={chain?.iconUrl as string}
              className="mx-0"
            />
          </Button>
        );
      }}
    </ConnectButtonRainbowkit.Custom>
  );
};
