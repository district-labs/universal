import { isValidChain } from 'universal-data';
import { isAddress } from 'viem';
import { z } from 'zod';

export const addressSchema = z.string().refine(isAddress);
export const chainIdSchema = z.coerce
  .number()
  .refine((val) => isValidChain(Number(val)));
export const redeemedCreditLineSchema = z.union([
  z.object({
    chainId: chainIdSchema,
    delegator: addressSchema,
    delegate: addressSchema.optional(),
  }),
  z.object({
    chainId: chainIdSchema,
    delegator: addressSchema.optional(),
    delegate: addressSchema,
  }),
  z.object({
    chainId: chainIdSchema,
    delegator: addressSchema,
    delegate: addressSchema,
  }),
]);
