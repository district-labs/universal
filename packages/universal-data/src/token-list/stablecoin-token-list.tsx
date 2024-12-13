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
        metadata: {
          protocol: 'Circle',
          url: 'https://www.usdc.com',
          description:
            'USDC is a digital dollar, always tied to the value of the US Dollar. Managed by Circle, it’s fully backed by real assets, making it a reliable and stable currency for digital transactions.',
        },
      },
    },
    {
      chainId: 8453,
      name: 'Prize USDC',
      symbol: 'przUSDC',
      logoURI: 'https://app.cabana.fi/icons/przUSDC.svg',
      address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
      decimals: 6,
      extensions: {
        protocol: 'pool-together-v5',
        metadata: {
          protocol: 'PoolTogether',
          type: 'Prize Savings',
          url: 'https://pooltogether.com',
          description: (
            <>
              <p>
                Prize USDC is a derivative of USDC, created after depositing
                into the PoolTogether protocol. When you deposit USDC into
                PoolTogether, it gets added to a lending protocol like Aave or
                Compound.
              </p>
              <p>
                The interest earned from lending USDC is used to generate prizes
                for the daily lottery. People who hold Prize USDC are entered
                into the lottery, and can win prizes in ETH every day.
              </p>
            </>
          ),
        },
      },
    },
    {
      chainId: 8453,
      name: 'Aave USDC',
      symbol: 'aUSDC',
      logoURI:
        'https://assets.coingecko.com/coins/images/14318/standard/aUSDC.e260d492.png?1696514006',
      address: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
      decimals: 6,
      extensions: {
        protocol: 'aave-v3',
        metadata: {
          protocol: 'Aave',
          type: 'Yield Bearing',
          url: 'https://aave.com',
          description:
            'Aave USDC is a derivative of USDC, created after depositing into the Aave protocol. When you deposit your USDC into Aave, it gets lent out to others, and you earn fees paid by borrowers.',
        },
      },
    },
    {
      chainId: 8453,
      name: 'Compound USDC',
      symbol: 'cUSDCv3',
      logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      address: '0xb125e6687d4313864e53df431d5425969c15eb2f',
      decimals: 6,
      extensions: {
        protocol: 'compound-v3',
      },
    },
  ],
};
