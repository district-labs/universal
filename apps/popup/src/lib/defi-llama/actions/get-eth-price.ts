import { z } from 'zod';

const responseSchema = z.object({
  coins: z.object({
    'coingecko:ethereum': z.object({
      price: z.number(),
      symbol: z.string(),
      timestamp: z.number(),
      confidence: z.number(),
    }),
  }),
});

export async function getEthPrice() {
  const response = await fetch(
    'https://coins.llama.fi/prices/current/coingecko:ethereum',
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ETH price');
  }

  const parsedData = responseSchema.safeParse(await response.json());

  if (!parsedData.success) {
    throw new Error('Failed to parse ETH price data');
  }

  return parsedData.data.coins['coingecko:ethereum'].price;
}
