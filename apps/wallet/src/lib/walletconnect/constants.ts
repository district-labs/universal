import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';

export const supportedChainIdsWc = [
  mainnet.id,
  sepolia.id,
  base.id,
  baseSepolia.id,
] as const;
