import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { universalWalletRainbowkit } from 'universal-wallet-connector';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [universalWalletRainbowkit, coinbaseWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
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
