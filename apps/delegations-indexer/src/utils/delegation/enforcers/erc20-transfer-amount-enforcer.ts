import { erc20TransferAmountAbi } from 'universal-data';
import {
  type Address,
  type Hex,
  decodeAbiParameters,
  encodeAbiParameters,
  encodePacked,
  getAbiItem,
  hexToBigInt,
  parseUnits,
  sliceHex,
} from 'viem';

type Erc20TransferAmountEventInputs = {
  sender: Address;
  redeemer: Address;
  delegationHash: Hex;
  limit: bigint;
  spent: bigint;
};

export type EncodeErc20TransferAmountEventParams =
  Erc20TransferAmountEventInputs;
export type EncodeErc20TransferAmountEventReturnType = Hex;
export function encodeErc20TransferAmountEvent({
  sender,
  redeemer,
  delegationHash,
  limit,
  spent,
}: EncodeErc20TransferAmountEventParams): EncodeErc20TransferAmountEventReturnType {
  return encodeAbiParameters(
    getAbiItem({
      abi: erc20TransferAmountAbi,
      name: 'IncreasedSpentMap',
    }).inputs,
    [sender, redeemer, delegationHash, limit, spent],
  );
}

export type DecodeErc20TransferAmountEventParams = Hex;
export type DecodeErc20TransferAmountEventReturnType =
  Erc20TransferAmountEventInputs;

export function decodeErc20TransferAmountEvent(
  encoded: DecodeErc20TransferAmountEventParams,
): DecodeErc20TransferAmountEventReturnType {
  const [sender, redeemer, delegationHash, limit, spent] = decodeAbiParameters(
    getAbiItem({
      abi: erc20TransferAmountAbi,
      name: 'IncreasedSpentMap',
    }).inputs,
    encoded,
  );

  return {
    sender,
    redeemer,
    delegationHash,
    limit,
    spent,
  };
}

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

export function decodeEnforcerERC20TransferAmount(data: Hex) {
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
