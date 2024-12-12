import { universalDeployments } from 'universal-data';
import type { Delegation, DelegationExecution } from 'universal-types';
import {
  type Address,
  type Hex,
  encodePacked,
  hexToBigInt,
  parseUnits,
  sliceHex,
  encodeAbiParameters,
} from 'viem';

export function encodeEnforcerERC20TransferAmount(data: {
  token: Address;
  amount: string;
  decimals: number;
}) {
  return encodePacked(
    ['address', 'uint256'],
    [data.token, parseUnits(data.amount, data.decimals)],
  );
}

const NoEnforcerFoundError = new Error('No ERC20TransferAmountEnforcer found');

export function decodeEnforcerERC20TransferAmount(data: Hex) {
  // Addresses are 20 bytes, uint256 is 32 bytes
  const addressSize = 20;
  const uint256Size = 32;

  // Decode `token` (first 20 bytes)
  const token = sliceHex(data, 0, addressSize) as Address;

  // Decode `amount` (next 32 bytes)
  const amountHex = sliceHex(data, addressSize, addressSize + uint256Size);
  const amount = hexToBigInt(amountHex);

  return {
    token,
    amount,
  };
}

export function getErc20TransferAmountEnforcerFromDelegation(
  delegation: Delegation,
) {
  const index = delegation.caveats.findIndex(
    ({ enforcer }) =>
      enforcer.toLowerCase() ===
      universalDeployments.ERC20TransferAmountEnforcer.toLowerCase(),
  );
  if (index === -1) {
    throw NoEnforcerFoundError;
  }

  const erc20TransferAmountEnforcer = delegation.caveats[index];

  if (!erc20TransferAmountEnforcer) {
    throw NoEnforcerFoundError;
  }

  return { erc20TransferAmountEnforcer, index };
}

export function getExternalHookEnforcerFromDelegation(delegation: Delegation) {
  const index = delegation.caveats.findIndex(
    ({ enforcer }) =>
      enforcer.toLowerCase() ===
      universalDeployments.ExternalCallEnforcer.toLowerCase(),
  );
  if (index === -1) {
    throw NoEnforcerFoundError;
  }

  const externalHookEnforcer = delegation.caveats[index];

  if (!externalHookEnforcer) {
    throw NoEnforcerFoundError;
  }

  return { externalHookEnforcer, index };
}

// Typescript implementation of: https://github.com/erc7579/erc7579-implementation/blob/main/src/lib/ExecutionLib.sol#L51-L62
export function encodeSingleExecution({
  calldata,
  target,
  value,
}: DelegationExecution): Hex {
  return encodePacked(
    ['address', 'uint256', 'bytes'],
    [target, value, calldata],
  );
}

export function encodeDelegation(delegation: Delegation): Hex {
  return encodeAbiParameters(
    [
      {
        name: '_delegation',
        type: 'tuple[]',
        internalType: 'struct Delegation',
        components: [
          {
            name: 'delegate',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'delegator',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'authority',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'caveats',
            type: 'tuple[]',
            internalType: 'struct Caveat[]',
            components: [
              {
                name: 'enforcer',
                type: 'address',
                internalType: 'address',
              },
              { name: 'terms', type: 'bytes', internalType: 'bytes' },
              { name: 'args', type: 'bytes', internalType: 'bytes' },
            ],
          },
          { name: 'salt', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    [[delegation]],
  );
}
