import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { testnetChains } from 'universal-data';
import { universalWalletRainbowkit } from 'universal-wallet-connector';
import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [universalWalletRainbowkit, walletConnectWallet],
    },
  ],
  {
    appName: 'Universal Wallet',
    projectId: 'cb444694b88d050cef9d9b71eb718a09',
  },
);

export const wagmiConfig = createConfig({
  chains: testnetChains,
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
});
