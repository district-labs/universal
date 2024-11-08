import {
  arbitrum,
  base,
  baseSepolia,
  foundry,
  gnosis,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia,
  polygon,
  sepolia,
} from '@wagmi/core/chains';

export const CHAIN_DATA: Record<
  number,
  {
    name: string;
    imgURL: string;
  }
> = {
  [mainnet.id]: {
    name: 'Ethereum',
    imgURL: '/images/networks/ethereum.svg',
  },
  [goerli.id]: {
    name: 'Goerli',
    imgURL: '/images/networks/ethereum-test.svg',
  },
  [optimism.id]: {
    name: 'Optimism',
    imgURL: '/images/networks/optimism.svg',
  },
  [optimismSepolia.id]: {
    name: 'Optimism',
    imgURL: '/images/networks/optimism.svg',
  },
  [gnosis.id]: {
    name: 'Gnosis',
    imgURL: '/images/networks/gnosis.svg',
  },
  [polygon.id]: {
    name: 'Polygon',
    imgURL: '/images/networks/polygon.svg',
  },
  [optimismGoerli.id]: {
    name: 'Optimism Goerli',
    imgURL: '/images/networks/optimism.svg',
  },
  [base.id]: {
    name: 'Base',
    imgURL: '/images/networks/base.svg',
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    imgURL: '/images/networks/base.svg',
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    imgURL: '/images/networks/arbitrum.svg',
  },
  [sepolia.id]: {
    name: 'Sepolia',
    imgURL: '/images/networks/ethereum-test.svg',
  },
  [foundry.id]: {
    name: 'Local',
    imgURL: '/images/networks/ethereum-test.svg',
  },
};

export function getChainData(chainId: number): {
  name: string;
  imgURL: string;
} {
  const chainData = CHAIN_DATA?.[chainId];

  if (!chainData) {
    return {
      name: 'Unknown',
      imgURL: '/images/networks/unknown.png',
    };
  }

  return chainData;
}

export const CHAIN_ID_TO_NAME: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [goerli.id]: 'goerli',
  [optimism.id]: 'optimism',
  [polygon.id]: 'matic-network',
  [optimismGoerli.id]: 'optimism-goerli',
  [base.id]: 'base',
  [arbitrum.id]: 'arbitrum',
  [sepolia.id]: 'sepolia',
};

export const NAME_TO_CHAIN_ID: Record<string, number> = {
  ethereum: mainnet.id,
  goerli: goerli.id,
  optimism: optimism.id,
  'matic-network': polygon.id,
  'optimism-goerli': optimismGoerli.id,
  base: base.id,
  arbitrum: arbitrum.id,
  sepolia: sepolia.id,
};
