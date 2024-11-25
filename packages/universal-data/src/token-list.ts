export const tokenList = {
  name: 'Universal Default',
  timestamp: '2023-09-08T19:28:15.497Z',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  tags: {},
  logoURI: '',
  keywords: ['universal', 'default'],
  tokens: [
    {
      name: 'USD Test',
      address: '0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B',
      symbol: 'USD',
      decimals: 18,
      chainId: 84532,
      logoURI: '/images/erc20/usd.png',
    },
    {
      name: 'EUR Test',
      address: '0x0b80094e3f92Aa24A7a584057AD671F686dbc669',
      symbol: 'EUR',
      decimals: 18,
      chainId: 84532,
      logoURI: '/images/erc20/eur.png',
    },
    {
      name: 'Emerald Gems',
      address: '0xb80aaFbE600329Eee68E55A46565412946EEC57F',
      symbol: 'GEM',
      decimals: 18,
      chainId: 1,
      logoURI: '/images/erc20/gem.png',
      extensions: {
        bridgeInfo: {
          '84532': {
            tokenAddress: '0xb80aaFbE600329Eee68E55A46565412946EEC57F',
          },
        },
      },
    },
  ],
};
