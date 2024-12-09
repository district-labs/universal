import { isProductionChain } from '../chains.js';
import { testnetTokenList } from '../token-list.js';
import type { TokenList } from 'universal-types';
import { stablecoinTokenList } from './stablecoin-token-list.js';

export function getDefaultTokenList({
  chainId,
}: {
  chainId: number;
}): TokenList {
  return isProductionChain(chainId) ? stablecoinTokenList : testnetTokenList;
}
