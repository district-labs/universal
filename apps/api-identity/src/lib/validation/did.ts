import { z } from 'zod';
import { addressSchema, chainIdSchema, hexSchema } from './utils.js';

// TODO: add keys
export const didDocumentSchema = z
  .object({
    '@context': z.literal('https://www.w3.org/ns/did/v1').array().length(1),
    // TODO: refine id validation
    id: z.string().min(1),
    alsoKnownAs: z.string().min(1).optional(),
    controller: z.string().min(1).optional(),
    verificationMethod: z
      .object({
        id: z.string().min(1),
        type: z.literal('EthEip6492'),
        controller: z.string().min(1),
      })
      .array(),
    authentication: z.string().min(1).array(),
    assertionMethod: z.string().min(1).array().optional(),
    keyAgreement: z.string().min(1).array().optional(),
    capabilityInvocation: z.string().min(1).array().optional(),
    capabilityDelegation: z.string().min(1).array().optional(),
    service: z
      .object({
        id: z.string().min(1),
        type: z.string().min(1),
        serviceEndpoint: z.string().min(1),
      })
      .array()
      .optional(),
  })
  .strict();

export type DidDocument = z.infer<typeof didDocumentSchema>;

export const postDidSchema = z.object({
  address: addressSchema,
  resolver: addressSchema,
  chainId: chainIdSchema,
  document: z.string(),
  signature: hexSchema,
});

// Endpoint Schemas
export type PostDid = z.infer<typeof postDidSchema>;
