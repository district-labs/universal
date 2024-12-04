import type { Address, Hex } from 'viem';

// Core Delegation Types //

export type DelegationExecution = {
  target: Address;
  value: bigint;
  calldata: Hex;
};

export type DelegationCaveat = {
  enforcer: Address;
  terms: Hex;
  args: Hex;
};

export type Delegation = {
  chainId: number;
  delegate: Address;
  delegator: Address;
  authority: Hex;
  caveats: DelegationCaveat[];
  salt: bigint;
  signature: Hex;
};

export type DelegationBatch = Delegation[];

// Variations with extra metadata //

export type DelegationCaveatWithMetadata = DelegationCaveat & {
  type: string;
};

export type DelegationWithMetadata = Omit<Delegation, 'caveats'> & {
  type: string;
  caveats: DelegationCaveatWithMetadata[];
};

export type DelegationWithChainId = Delegation & {
  chainId: number;
};
export type DelegationWithChainIdMetadata = DelegationWithMetadata & {
  chainId: number;
};

export type DelegationWithChainIdMetadataHash =
  DelegationWithChainIdMetadata & {
    hash: Hex;
  };
export type DelegationBatchWithMetadata = DelegationWithMetadata[];
export type DelegationBatchWithChainId = DelegationWithChainId[];
export type DelegationBatchWithChainIdMetadata =
  DelegationWithChainIdMetadata[];
