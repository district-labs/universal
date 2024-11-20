import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { universalWalletRainbowkit } from 'universal-wallet-connector';
import { createPublicClient } from 'viem';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia, mainnet } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [universalWalletRainbowkit, coinbaseWallet, metaMaskWallet],
    },
  ],
  {
    appName: 'Universal Wallet',
    projectId: '97f5c1a3ff6472301394f11c869fc601',
  },
);

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
