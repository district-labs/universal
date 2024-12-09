import type { TokenItem, TokenList } from 'universal-types';

export function findToken({
  address,
  tokenList,
}: { address: string; tokenList: TokenList }): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase(),
  );
}
