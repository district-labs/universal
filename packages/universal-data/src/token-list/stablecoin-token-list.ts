import type { TokenList } from '../types.js';

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
      name: 'USDCoin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      extensions: {
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
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      extensions: {
        bridgeInfo: {
          '10': {
            tokenAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          },
          '42161': {
            tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          },
        },
      },
    },
    {
      chainId: 1,
      address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
      name: 'USDS Stablecoin',
      symbol: 'USDS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/39926/large/usds.webp?1726666683',
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
      address: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
      name: 'PayPal USD',
      symbol: 'PYUSD',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png?1691458314',
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
      chainId: 1,
      address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
      name: 'Gemini Dollar',
      symbol: 'GUSD',
      decimals: 2,
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/thumb/gemini-dollar-gusd.png?1536745278',
    },
    {
      name: 'USDCoin',
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      symbol: 'USDC',
      decimals: 6,
      chainId: 10,
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
      name: 'Tether USD',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      symbol: 'USDT',
      decimals: 6,
      chainId: 10,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          },
        },
      },
    },
    {
      name: 'Dai Stablecoin',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      decimals: 18,
      chainId: 10,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          },
        },
      },
    },
    {
      chainId: 10,
      name: 'Liquity USD',
      symbol: 'LUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327',
      address: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
      decimals: 18,
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
          },
        },
      },
    },
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
    {
      name: 'USDCoin',
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 6,
      chainId: 42161,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          },
        },
      },
    },
    {
      name: 'Tether USD',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      symbol: 'USDT',
      decimals: 6,
      chainId: 42161,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          },
        },
      },
    },
    {
      name: 'Dai Stablecoin',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      decimals: 18,
      chainId: 42161,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      extensions: {
        bridgeInfo: {
          '1': {
            tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          },
        },
      },
    },
    {
      chainId: 42161,
      name: 'Liquity USD',
      symbol: 'LUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327',
      address: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b',
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
