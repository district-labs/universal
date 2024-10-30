import { base, baseSepolia } from 'viem/chains';

export const CHAINS = {
  [base.id]: base.rpcUrls.default.http[0],
  [baseSepolia.id]: baseSepolia.rpcUrls.default.http[0],
};
