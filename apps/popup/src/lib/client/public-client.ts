import type { Chain } from '@/types';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export function getPublicClient({
  chainId,
}: {
  chainId: Chain['id'];
}) {
  switch (chainId) {
    case base.id:
      return basePublicClient;
    case baseSepolia.id:
      return baseSepoliaPublicClient;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
