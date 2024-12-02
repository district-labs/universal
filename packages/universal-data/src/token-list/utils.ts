import { isProductionChain } from '../chains.js';
import { testnetTokenList } from '../token-list.js';
import type { TokenList } from '../types.js';
import { stablecoinTokenList } from './stablecoin-token-list.js';

export function getDefaultTokenList({
  chainId,
}: {
  chainId: number;
}): TokenList {
  return isProductionChain(chainId) ? stablecoinTokenList : testnetTokenList;
}
