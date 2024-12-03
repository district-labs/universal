import type { ValidChain } from 'universal-data';
import { base, baseSepolia } from 'viem/chains';

export const CHAINS: Record<ValidChain['id'], string> = {
  [base.id]: base.rpcUrls.default.http[0],
  [baseSepolia.id]: baseSepolia.rpcUrls.default.http[0],
};
