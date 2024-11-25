import { tokenList } from '../token-list.js';
import type { TokenItem } from '../types.js';

export function findTokenByAddress(address: string): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase(),
  );
}
