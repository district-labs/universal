import { createConfig } from '@wagmi/core';
import { validChains } from 'universal-data';
import { http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: validChains,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
