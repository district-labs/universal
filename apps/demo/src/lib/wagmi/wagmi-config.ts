import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { universalWalletRainbowkit } from 'universal-wallet-connector';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [universalWalletRainbowkit],
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
