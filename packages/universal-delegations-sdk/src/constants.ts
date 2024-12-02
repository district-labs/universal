import { type Hex, keccak256, toHex, type Address } from 'viem';

// Delegation constants
export const ANY_DELEGATE =
  '0x0000000000000000000000000000000000000a11' as Address;
export const ROOT_AUTHORITY =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' as Hex;

// Execution Modes
export const BATCH_EXECUTION_MODE = [
  '0x0100000000000000000000000000000000000000000000000000000000000000' as Hex,
];
export const SINGLE_EXECUTION_MODE = [
  '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex,
];
export const EMPTY_ARGS = '0x';
export const EMPTY_SIGNATURE = '0x';
export const SALT = BigInt(0);

export const CAVEAT_TYPEHASH = keccak256(
  toHex('Caveat(address enforcer,bytes terms)'),
);

export const DELEGATION_TYPEHASH = keccak256(
  toHex(
    'Delegation(address delegate,address delegator,bytes32 authority,Caveat[] caveats,uint256 salt)Caveat(address enforcer,bytes terms)',
  ),
);
