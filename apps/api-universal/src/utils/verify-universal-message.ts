import { isValidChain } from 'universal-data';
import type { Address, Hex } from 'viem';
import { getPublicClient } from '../clients.js';

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
  if (!isValidChain(chainId)) {
    throw new Error('Invalid chainId');
  }
  const publicClient = getPublicClient(chainId);
  const isValidSignature = await publicClient.verifyTypedData({
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
