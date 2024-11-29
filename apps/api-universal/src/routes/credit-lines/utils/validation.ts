import { isAddress } from 'viem';
import { z } from 'zod';

export const addressSchema = z.string().refine(isAddress);
export const creditTypeSchema = z
  .string()
  .optional()
  .default('DebitAuthorization');
export const getCreditLineSchema = z.union([
  z.object({
    delegator: addressSchema,
    delegate: addressSchema.optional(),
    type: creditTypeSchema,
    chainId: z.number(),
  }),
  z.object({
    delegator: addressSchema.optional(),
    delegate: addressSchema,
    type: creditTypeSchema,
    chainId: z.number(),
  }),
  z.object({
    delegator: addressSchema,
    delegate: addressSchema,
    type: creditTypeSchema,
    chainId: z.number(),
  }),
]);
