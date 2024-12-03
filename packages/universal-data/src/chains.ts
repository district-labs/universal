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

export type ValidChain = ProductionChain | TestnetChain;
export const validChains = [...productionChains, ...testnetChains] as const;
export const validChainIds = validChains.map(
  (chain) => chain.id as ValidChain['id'],
);

// L2 chains
export type L2Chain = (typeof l2Chains)[number];
export const l2Chains = [base, baseSepolia] as const;
export const l2ChainIds = l2Chains.map((chain) => chain.id as L2Chain['id']);

// util functions
export function isProductionChain(
  chainId: number,
): chainId is ProductionChain['id'] {
  return productionChainIds.includes(chainId as ProductionChain['id']);
}

export function isTestnetChain(chainId: number): chainId is TestnetChain['id'] {
  return testnetChainIds.includes(chainId as TestnetChain['id']);
}

export function isValidChain(chainId: number): chainId is ValidChain['id'] {
  return isProductionChain(chainId) || isTestnetChain(chainId);
}

export function isL2Chain(chainId: number): chainId is L2Chain['id'] {
  return l2ChainIds.includes(chainId as L2Chain['id']);
}
