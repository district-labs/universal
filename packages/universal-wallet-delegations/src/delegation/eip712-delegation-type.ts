export const eip712DelegationTypes = {
  EIP712Domain: [],
  Caveat: [
    {
      name: 'enforcer',
      type: 'address',
    },
    {
      name: 'terms',
      type: 'bytes',
    },
  ],
  Delegation: [
    {
      name: 'delegate',
      type: 'address',
    },
    {
      name: 'delegator',
      type: 'address',
    },
    {
      name: 'authority',
      type: 'bytes32',
    },
    {
      name: 'caveats',
      type: 'Caveat[]',
    },
    {
      name: 'salt',
      type: 'uint256',
    },
  ],
} as const;
