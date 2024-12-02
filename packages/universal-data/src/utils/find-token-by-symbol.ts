import type { TokenItem, TokenList } from '../types.js';

export function findTokenBySymbol({
  symbol,
  tokenList,
}: { symbol: string; tokenList: TokenList }): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}
