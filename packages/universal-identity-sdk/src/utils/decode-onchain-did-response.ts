import { type Hex, decodeAbiParameters } from 'viem';

export function decodeOnchainDidResponse({
  data,
}: {
  data: Hex;
}) {
  return decodeAbiParameters(
    [
      {
        name: 'identifier',
        type: 'tuple',
        internalType: 'struct DIDDocument',
        components: [
          {
            name: 'data',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'signature',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'status',
            type: 'uint8',
            internalType: 'enum DIDStatus',
          },
        ],
      },
    ],
    data,
  );
}
