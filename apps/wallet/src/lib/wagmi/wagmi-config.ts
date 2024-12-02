import { env } from '@/env';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { productionChains, testnetChains } from 'universal-data';
import { universalWalletRainbowkit } from 'universal-wallet-connector';
import { createPublicClient } from 'viem';
import { http, createConfig } from 'wagmi';
import { base, baseSepolia, mainnet } from 'wagmi/chains';
import { isProductionEnv } from '../chains';

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

const chains = isProductionEnv ? productionChains : testnetChains;

export const wagmiConfig = createConfig({
  chains: chains,
  connectors,
  transports: {
    [base.id]: http(env.NEXT_PUBLIC_RPC_URL_BASE),
    [baseSepolia.id]: http(env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA),
  },
});

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(env.NEXT_PUBLIC_RPC_URL_MAINNET),
});
