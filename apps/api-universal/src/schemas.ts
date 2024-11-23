import type { Address, Hex } from 'viem';
import { z } from 'zod';

export const getAccountByAddress = z.object({
  address: z.custom<Address>((val) => val.length > 10 && val.startsWith('0x'), {
    message: 'invalid address',
  }),
});

export const postAccountSchema = z.object({
  chainId: z.number(),
  address: z.custom<Address>(),
  signature: z.custom<Hex>(),
});
