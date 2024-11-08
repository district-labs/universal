import { isAddress, isHex } from 'viem';
import { z } from 'zod';

// Ethereum Schemas

export const addressSchema = z.string().refine((value) => isAddress(value), {
  message: 'Invalid address',
});

export const hexSchema = z.string().refine((value) => isHex(value), {
  message: 'Invalid hex',
});

export const smartwalletSchema = z.object({
  address: addressSchema,
  salt: hexSchema,
  deployer: addressSchema,
});

// Utils

export const coercedNumberSchema = z.coerce.number({
  message: 'Invalid number',
});
export const coercedBigIntSchema = z.coerce.bigint({
  message: 'Invalid bigint',
});

export const slugSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      /^(?!.*[-_]{2,})(?![-_])[a-z0-9]+(?:[-_][a-z0-9]+)*(?<![-_])$/.test(
        value,
      ),
    {
      message: 'Invalid slug',
    },
  );
