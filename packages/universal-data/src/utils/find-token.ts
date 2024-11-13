import { tokenDeployments } from '../tokens.js';
import type { Token } from '../types.js';

export function findToken(chainId: number, address: string): Token | undefined {
  const tokens = tokenDeployments[chainId];
  
  if (!tokens) return undefined;

  return tokens.find(token => token.address.toLowerCase() === address.toLowerCase());
}