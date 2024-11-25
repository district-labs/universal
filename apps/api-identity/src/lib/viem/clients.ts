import { http, createPublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
  batch: {
    multicall: true,
  },
});

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
  batch: {
    multicall: true,
  },
});
