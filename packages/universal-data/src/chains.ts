import { base, baseSepolia } from 'viem/chains';

export type ProductionChain = (typeof productionChains)[number];
export const productionChains = [base] as const;
export const productionChainIds = productionChains.map(
  (chain) => chain.id,
) as ProductionChain['id'][];

export type TestnetChain = (typeof testnetChains)[number];
export const testnetChains = [baseSepolia] as const;
export const testnetChainIds = testnetChains.map(
  (chain) => chain.id,
) as TestnetChain['id'][];

// util functions
export function isProductionChain(
  chainId: number,
): chainId is ProductionChain['id'] {
  return productionChainIds.includes(chainId as ProductionChain['id']);
}

export function isTestnetChain(chainId: number): chainId is TestnetChain['id'] {
  return testnetChainIds.includes(chainId as TestnetChain['id']);
}
