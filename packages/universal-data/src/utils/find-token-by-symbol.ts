import { tokenList } from '../token-list.js';
import type { TokenItem } from '../types.js';

export function findTokenBySymbol(symbol: string): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}
