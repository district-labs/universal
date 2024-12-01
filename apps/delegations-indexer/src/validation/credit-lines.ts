import { isAddress } from 'viem';
import { z } from 'zod';

export const addressSchema = z.string().refine(isAddress);
export const redeemedCreditLineSchema = z.union([
  z.object({
    delegator: addressSchema,
    delegate: addressSchema.optional(),
  }),
  z.object({
    delegator: addressSchema.optional(),
    delegate: addressSchema,
  }),
  z.object({
    delegator: addressSchema,
    delegate: addressSchema,
  }),
]);
