export const multicallAbi = [
  {
    type: 'function',
    name: 'multicall',
    inputs: [
      {
        name: '_executions',
        type: 'tuple[]',
        internalType: 'struct Execution[]',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'CallReverted',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
  },
] as const;
