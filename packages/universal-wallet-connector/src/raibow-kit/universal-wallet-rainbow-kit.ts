import { type CreateConnectorFn, createConnector } from 'wagmi';
import {
  universalWallet as universalConnector,
  type UniversalWalletParameters,
} from '../universalWallet.js';

import type { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit';

interface UniversalWallet {
  (params: UniversalWalletParameters): Wallet;
}

export const universalWalletRainbowkit: UniversalWallet = ({
  appName,
  appLogoUrl,
}) => {
  return {
    id: 'universalWallet',
    name: 'Universal Wallet',
    shortName: 'Universal Wallet',
    iconUrl:
      'https://github.com/user-attachments/assets/0d747d77-a14c-4ee9-b519-60a1329aae2e',
    iconAccent: '#fff',
    iconBackground: '#fff',
    createConnector: (walletDetails: WalletDetailsParams) => {
      // @ts-expect-error
      const connector: CreateConnectorFn = universalConnector({
        appName,
        appLogoUrl,
      });

      return createConnector((config) => ({
        ...connector(config),
        ...walletDetails,
      }));
    },
  };
};
