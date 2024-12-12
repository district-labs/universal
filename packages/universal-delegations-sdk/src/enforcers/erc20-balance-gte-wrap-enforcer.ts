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
