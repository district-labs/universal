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
  type: string | null;
};

export type DelegationWithMetadata = Omit<Delegation, 'caveats'> & {
  hash: Hex;
  chainId: number;
  type: string | null;
  verifyingContract: Address;
  caveats: DelegationCaveatWithMetadata[];
};

export type DelegationBatchWithMetadata = DelegationWithMetadata[];
