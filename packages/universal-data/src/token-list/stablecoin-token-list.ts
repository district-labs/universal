import type { TokenList } from 'universal-types';

export const stablecoinTokenList: TokenList = {
  name: 'Universal Stablecoin Token List',
  timestamp: '2023-09-08T19:28:15.497Z',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  tags: {},
  logoURI: '',
  keywords: ['universal', 'stablecoin'],
  tokens: [
    {
      name: 'USD Coin',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      decimals: 6,
      chainId: 8453,
      logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          },
        },
      },
    },
    {
      chainId: 8453,
      name: 'Prize USDC (Savings Account)',
      symbol: 'przUSDC',
      logoURI: 'https://app.cabana.fi/icons/przUSDC.svg',
      address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
      decimals: 6,
    },
    {
      chainId: 8453,
      name: 'Aave USDC (Yield Bearing)',
      symbol: 'aUSDC',
      logoURI:
        'https://assets.coingecko.com/coins/images/14318/standard/aUSDC.e260d492.png?1696514006',
      address: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      decimals: 18,
      chainId: 8453,
      logoURI: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          },
        },
      },
    },
    {
      chainId: 8453,
      name: 'Liquity USD',
      symbol: 'LUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327',
      address: '0x368181499736d0c0CC614DBB145E2EC1AC86b8c6',
      decimals: 18,
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
          },
        },
      },
    },
  ],
};
