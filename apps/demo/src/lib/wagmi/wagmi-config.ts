import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { universalWallet } from 'universal-wallet-connector';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Universal Wallet',
      preference: 'smartWalletOnly',
    }),
    // @ts-expect-error
    universalWallet({
      appName: 'Universal Wallet',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
