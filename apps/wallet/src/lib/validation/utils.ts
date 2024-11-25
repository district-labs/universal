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

// Regular expression to match Ethereum URIs with optional parameters
export const ethereumUriRegex =
  /^ethereum:(0x[a-fA-F0-9]{40})(\?(?<params>.+))?$/;

// Zod schema for Ethereum URI
export const ethereumUriSchema = z
  .string()
  .regex(ethereumUriRegex, {
    message: 'Invalid Ethereum URI format',
  })
  .transform((uri) => {
    const match = uri.match(ethereumUriRegex);
    if (!match || !match.groups) {
      throw new Error('Invalid Ethereum URI format');
    }
    const address = match[1];
    const paramsString = match.groups.params || '';
    const params: Record<string, string> = {};
    paramsString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = value;
      }
    });
    return { address, params };
  });

// Regular expression to match DID format: did:uis:chainId:resolver:account
export const didUriRegex =
  /^did:uis:([a-zA-Z0-9]+):([a-zA-Z0-9]+):0x[a-fA-F0-9]{40}$/;

// Zod schema for DIDs
export const didUriSchema = z
  .string()
  .regex(didUriRegex, {
    message: 'Invalid DID format',
  })
  .transform((did) => {
    const [_, chainId, resolver, account] = did.split(':');
    return { chainId: Number(chainId), resolver, account };
  });
