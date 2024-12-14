import { encodePacked, type Hex, type Address } from 'viem';

export type EncodeExternalHookArgsParams = {
  target: Address;
  callData: Hex;
};

export function encodeExternalCallEnforcerArgs({
  target,
  callData,
}: EncodeExternalHookArgsParams) {
  return encodePacked(['address', 'bytes'], [target, callData]);
}
