import { isValidChain } from 'universal-data';
import { type Hex, isAddress, isHex } from 'viem';
import { z } from 'zod';

export const neverSchema = z.never().optional();
export const typeSchema = z.string().refine((val) => val.length > 0, {
  message: 'invalid type',
});
export const hexSchema = z.custom<Hex>().refine((val) => isHex(val), {
  message: 'invalid hash',
});
export const addressSchema = z.string().refine(isAddress, {
  message: 'invalid address',
});
export const chainIdSchema = z.coerce
  .number()
  .refine((val) => isValidChain(val), {
    message: 'invalid chainId',
  });
const commonPropertiesGetDelegationsSchema = z.object({
  chainId: chainIdSchema,
  type: typeSchema.optional(),
});

export type GetDelegationParams = z.infer<typeof getDelegationSchema>;
export const getDelegationSchema = z.object({
  hash: hexSchema,
});

export type GetDelegationsParams = z.infer<typeof getDelegationsSchema>;
export const getDelegationsSchema = z.union([
  commonPropertiesGetDelegationsSchema.merge(
    z.object({
      delegate: neverSchema,
      delegator: addressSchema,
    }),
  ),
  commonPropertiesGetDelegationsSchema.merge(
    z.object({
      delegate: addressSchema,
      delegator: neverSchema,
    }),
  ),
  commonPropertiesGetDelegationsSchema.merge(
    z.object({
      delegator: addressSchema,
      delegate: addressSchema,
    }),
  ),
]);

export const postDelegationSchema = z.object({
  hash: hexSchema,
  type: typeSchema,
  verifyingContract: addressSchema,
  chainId: chainIdSchema,
  delegator: addressSchema,
  delegate: addressSchema,
  authority: hexSchema,
  salt: z.string().transform((val) => BigInt(val)),
  signature: hexSchema,
  caveats: z.array(
    z.object({
      type: typeSchema,
      enforcer: addressSchema,
      terms: hexSchema,
      args: hexSchema,
    }),
  ),
});
