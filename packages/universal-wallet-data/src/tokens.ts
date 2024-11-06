import { baseSepolia } from 'viem/chains';
import type { Token } from './types.js';

export const tokenDeployments: {
  [chainId: number]: Token[];
} = {
  [baseSepolia.id as number]: [
    {
      address: '0xb80aaFbE600329Eee68E55A46565412946EEC57F',
      name: 'Emerald Gems',
      symbol: 'GEM',
      decimals: 18,
      img: '/images/erc20/gem.png',
    },
  ],
} as const;