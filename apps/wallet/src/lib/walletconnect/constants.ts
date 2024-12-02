import { productionChainIds, testnetChainIds } from 'universal-data';

export const supportedChainIdsWc = [
  ...productionChainIds,
  ...testnetChainIds,
] as const;
