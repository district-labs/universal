import { type Address, type Hex, encodePacked } from 'viem';

export type EncodeExternalHookEnforcerArgsParams = {
  target: Address;
  callData: Hex;
};

export function encodeExternalHookEnforcerArgs({
  target,
  callData,
}: EncodeExternalHookEnforcerArgsParams) {
  return encodePacked(['address', 'bytes'], [target, callData]);
}
