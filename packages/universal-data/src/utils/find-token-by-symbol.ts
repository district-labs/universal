import type { TokenItem, TokenList } from 'universal-types';

export function findTokenBySymbol({
  symbol,
  tokenList,
}: { symbol: string; tokenList: TokenList }): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}
