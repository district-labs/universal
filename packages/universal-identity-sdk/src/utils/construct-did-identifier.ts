import type { Address } from 'viem';

export type ConstructDidIdentifierParameters = {
  address: Address;
  resolver: Address;
  chainId: number;
};

export function constructDidIdentifier(
  parameters: ConstructDidIdentifierParameters,
) {
  const { address, chainId, resolver } = parameters;
  return `did:uis:${chainId}:${resolver}:${address}`;
}
