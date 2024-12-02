'use client';

import { env } from '@/env';
import { useMemo } from 'react';
import {
  isProductionChain,
  isTestnetChain,
  productionChains,
  stablecoinTokenList,
  testnetChains,
  testnetTokenList,
} from 'universal-data';
import { useChainId } from 'wagmi';

export const isProductionEnv = env.NEXT_PUBLIC_ENV === 'PRODUCTION';
// TODO: Update logic once we have support for multiple chains in each environment
/**
 * Gets the default chain based on the app's environment
 * @returns
 */
export const defaultChain =
  env.NEXT_PUBLIC_ENV === 'PRODUCTION' ? productionChains[0] : testnetChains[0];

// TODO: Update logic once we have support for multiple chains in each environment
/**
 * Gets the token list based on the app's environment
 */
export const defaultTokenList =
  env.NEXT_PUBLIC_ENV === 'PRODUCTION' ? stablecoinTokenList : testnetTokenList;

/**
 * Checks if the chain is valid based on the app's environment
 * @param chainId The chain ID to check
 * @returns True if the chain is valid, false otherwise
 */
export function isValidChain(chainId: number) {
  if (env.NEXT_PUBLIC_ENV === 'PRODUCTION') {
    return isProductionChain(chainId);
  }

  return isTestnetChain(chainId);
}

export function useIsValidChain() {
  const chainId = useChainId();
  const validChain = useMemo(() => isValidChain(chainId), [chainId]);

  return { chainId, defaultChain, isValidChain: validChain };
}
