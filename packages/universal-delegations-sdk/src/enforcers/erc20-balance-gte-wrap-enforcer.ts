import { universalDeployments } from 'universal-data';
import type { Delegation, DelegationCaveat } from 'universal-types';
import {
  type Address,
  type Hex,
  encodePacked,
  hexToBigInt,
  sliceHex,
} from 'viem';

export function encodeERC20BalanceGteWrapEnforcerTerms({
  amount,
  token,
}: {
  amount: bigint;
  token: Address;
}) {
  return encodePacked(['address', 'uint256'], [token, amount]);
}

export function decodeERC20BalanceGteWrapEnforcerTerms(data: Hex) {
  // Addresses are 20 bytes, uint256 is 32 bytes
  const addressSize = 20;
  const uint256Size = 32;

  // Decode `token` (first 20 bytes)
  const token = sliceHex(data, 0, addressSize) as Address;

  // Decode `amount` (next 32 bytes)
  const amountHex = sliceHex(data, addressSize, addressSize + uint256Size);
  const amount = hexToBigInt(amountHex);

  return [token, BigInt(amount)] as const;
}

export function getERC20BalanceGteWrapEnforcerFromDelegation(
  delegation: Delegation,
): DelegationCaveat {
  const erc20TransferAmountEnforcer = delegation.caveats.find(
    ({ enforcer }) =>
      enforcer.toLowerCase() ===
      universalDeployments.ERC20BalanceGteWrapEnforcer.toLowerCase(),
  );
  if (!erc20TransferAmountEnforcer) {
    throw new Error('No ERC20TransferAmountEnforcer found');
  }

  return erc20TransferAmountEnforcer;
}
