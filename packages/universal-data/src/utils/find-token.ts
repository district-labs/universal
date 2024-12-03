import type { TokenItem, TokenList } from '../types.js';

export function findToken({
  address,
  tokenList,
}: { address: string; tokenList: TokenList }): TokenItem | undefined {
  return tokenList.tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase(),
  );
}
