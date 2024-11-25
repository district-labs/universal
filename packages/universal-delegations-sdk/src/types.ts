import type { Address, Hex } from 'viem';

// From https://github.com/erc7579/erc7579-implementation/blob/main/src/interfaces/IERC7579Account.sol#L6-L10
export type Execution = {
  target: Address;
  value: bigint;
  calldata: Hex;
};

// From https://github.com/MetaMask/delegation-framework/blob/main/src/utils/Types.sol#L38-L42
export type Caveat = {
  enforcerType?: string;
  enforcer: Address;
  // Terms and args are bytes with different encodings by enforcer
  terms: Hex;
  args: Hex;
};

// From https://github.com/MetaMask/delegation-framework/blob/main/src/utils/Types.sol#L24-L31
export type Delegation = {
  chainId: number;
  delegate: Address;
  delegator: Address;
  authority: Hex;
  caveats: Caveat[];
  salt: bigint;
  signature: Hex;
};
