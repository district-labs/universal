import {
  encodePacked,
  sliceHex,
  type Hex,
  hexToBigInt,
  maxUint128,
} from 'viem';

export type EncodeEnforcerTimestampParams =
  | {
      timestampAfter: bigint;
      timestampBefore?: never;
    }
  | {
      timestampAfter?: never;
      timestampBefore: bigint;
    }
  | {
      timestampAfter: bigint;
      timestampBefore: bigint;
    };
export type EncodeEnforcerTimestampReturnType = Hex;

export function encodeEnforcerTimestamp({
  timestampAfter,
  timestampBefore,
}: EncodeEnforcerTimestampParams): EncodeEnforcerTimestampReturnType {
  // If no timestampAfter is provided, default to 0, accepting all timestamps
  timestampAfter = timestampAfter ?? BigInt(0);

  // If no timestampBefore is provided, default to maxUint128, accepting all timestamps
  timestampBefore = timestampBefore ?? maxUint128;

  return encodePacked(
    ['uint128', 'uint128'],
    [timestampBefore, timestampAfter],
  );
}

export type DecodeEnforcerTimestampParams = Hex;
export type DecodeEnforcerTimestampReturnType = {
  timestampAfter: bigint;
  timestampBefore: bigint;
};

export function decodeEnforcerTimestamp(
  data: DecodeEnforcerTimestampParams,
): DecodeEnforcerTimestampReturnType {
  const uint128Size = 16;

  const timestampBefore = hexToBigInt(sliceHex(data, 0, uint128Size));
  const timestampAfter = hexToBigInt(
    sliceHex(data, uint128Size, uint128Size * 2),
  );
  return {
    timestampBefore,
    timestampAfter,
  };
}
