import { concatHex, encodeAbiParameters, keccak256 } from 'viem';

import { CAVEAT_TYPEHASH, DELEGATION_TYPEHASH } from './constants.js';
import type { Caveat, Delegation } from './types.js';

// Implementation of: https://github.com/MetaMask/delegation-framework/blob/main/src/libraries/EncoderLib.sol#L18
export function getDelegationHash(delegation: Delegation) {
  const encodedCaveatArrayPacketHash = getCaveatArrayPacketHash(
    delegation.caveats,
  );
  const encoded = encodeAbiParameters(
    [
      { name: 'delegationTypeHash', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
      { name: 'delegator', type: 'address' },
      { name: 'authority', type: 'bytes32' },
      { name: 'encodedCaveatArrayPacketHash', type: 'bytes32' },
      { name: 'salt', type: 'uint256' },
    ],
    [
      DELEGATION_TYPEHASH,
      delegation.delegate,
      delegation.delegator,
      delegation.authority,
      encodedCaveatArrayPacketHash,
      BigInt(delegation.salt),
    ],
  );

  return keccak256(encoded);
}

export function getCaveatArrayPacketHash(caveats: Caveat[]) {
  const caveatPacketHashes = caveats.map((caveat) =>
    getCaveatPacketHash(caveat),
  );
  // Concatenate the bytes32 hashes directly
  const concatenatedHashes = concatHex(caveatPacketHashes);
  return keccak256(concatenatedHashes);
}

export function getCaveatPacketHash(caveat: Caveat) {
  const encoded = encodeAbiParameters(
    [
      { name: 'caveatTypeHash', type: 'bytes32' },
      { name: 'enforcer', type: 'address' },
      { name: 'terms', type: 'bytes32' },
    ],
    [CAVEAT_TYPEHASH, caveat.enforcer, keccak256(caveat.terms)],
  );

  return keccak256(encoded);
}
