import { productionChainIds, testnetChainIds } from 'universal-data';
import { mainnet } from 'viem/chains';

export const supportedChainIdsWc = [
  mainnet.id,
  ...productionChainIds,
  ...testnetChainIds,
] as const;
