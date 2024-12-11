import { erc20TransferAmountEnforcerAbi } from 'universal-data';
import {
  type Address,
  type Hex,
  decodeAbiParameters,
  encodeAbiParameters,
  getAbiItem,
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
      abi: erc20TransferAmountEnforcerAbi,
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
      abi: erc20TransferAmountEnforcerAbi,
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
