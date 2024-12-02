import type { TokenList } from '../types.js';

export const leaderboardTokenList: TokenList = {
  name: 'Universal Leaderboard Token List',
  timestamp: '2023-09-08T19:28:15.497Z',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  tags: {},
  logoURI: '',
  keywords: ['universal', 'leaderboard'],
  tokens: [
    {
      name: 'USDCoin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      extensions: {
        multiplier: '1',
        bridgeInfo: {
          '10': {
            tokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          },
          '8453': {
            tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          },
          '42161': {
            tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          },
        },
      },
    },
    {
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      extensions: {
        multiplier: '1.5',
        bridgeInfo: {
          '10': {
            tokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          },
          '8453': {
            tokenAddress: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
          },
          '42161': {
            tokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          },
        },
      },
    },
    {
      chainId: 1,
      name: 'Liquity USD',
      symbol: 'LUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327',
      address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
      decimals: 18,
      extensions: {
        multiplier: '2',
        bridgeInfo: {
          '10': {
            tokenAddress: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
          },
          '8453': {
            tokenAddress: '0x368181499736d0c0CC614DBB145E2EC1AC86b8c6',
          },
          '42161': {
            tokenAddress: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b',
          },
        },
      },
    },
    {
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      extensions: {
        multiplier: '0.5',
        bridgeInfo: {
          '10': {
            tokenAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          },
          '8453': {
            tokenAddress: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
          },
          '42161': {
            tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          },
        },
      },
    },
  ],
};
