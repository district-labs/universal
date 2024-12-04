import type { ValidChain } from 'universal-data';
import { base, baseSepolia } from 'viem/chains';
import { basePublicClient, baseSepoliaPublicClient } from './clients.js';

export function getPublicClient(chainId: ValidChain['id']) {
  switch (chainId) {
    case base.id:
      return basePublicClient;
    case baseSepolia.id:
      return baseSepoliaPublicClient;
    default:
      throw new Error('Invalid chain ID');
  }
}
