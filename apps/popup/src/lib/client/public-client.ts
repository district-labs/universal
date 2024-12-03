import { env } from '@/env';
import type { ValidChain } from 'universal-data';
import { http, createPublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(env.NEXT_PUBLIC_RPC_URL_BASE),
});

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA),
});

export function getPublicClient({
  chainId,
}: {
  chainId: ValidChain['id'];
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
