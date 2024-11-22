import type { Address, Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { baseSepoliaPublicClient } from '../clients.js';

export async function verifyUniversalMessage({
  chainId,
  address,
  content,
  signature,
}: {
  chainId: number;
  address: Address;
  content: string;
  signature: Hex;
}) {
  if (chainId !== baseSepolia.id) {
    throw new Error('Invalid chainId');
  }

  const isValidSignature = await baseSepoliaPublicClient.verifyTypedData({
    signature,
    address,
    types: { UniversalMessage: [{ name: 'content', type: 'string' }] },
    primaryType: 'UniversalMessage',
    domain: {
      name: 'Universal Resolver',
      version: '1',
      chainId: chainId,
    },
    message: {
      content: content,
    },
  });

  return isValidSignature;
}
