import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { universalWalletRainbowkit } from 'universal-wallet-connector';
import { coinbaseWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [universalWalletRainbowkit, coinbaseWallet, metaMaskWallet],
    },
  ],
  {
    appName: 'Universal Wallet',
    projectId: 'YOUR_PROJECT_ID',
  },
);

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export const baseConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
