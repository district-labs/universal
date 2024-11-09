export const documentAbi = [
  {
    type: "function",
    name: "generate",
    inputs: [
      { name: "router", type: "address", internalType: "address" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "StringsInsufficientHexLength",
    inputs: [
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "length", type: "uint256", internalType: "uint256" },
    ],
  },
] as const;

export const resolverAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "_implementation", type: "address", internalType: "address" },
      { name: "_url", type: "string", internalType: "string" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "completeOwnershipHandover",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "create",
    inputs: [{ name: "_account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "generate",
    inputs: [
      { name: "router", type: "address", internalType: "address" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAddress",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initCodeHash",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidSig",
    inputs: [
      { name: "_signer", type: "address", internalType: "address" },
      { name: "_hash", type: "bytes32", internalType: "bytes32" },
      { name: "_signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isValidSigImpl",
    inputs: [
      { name: "_signer", type: "address", internalType: "address" },
      { name: "_hash", type: "bytes32", internalType: "bytes32" },
      { name: "_signature", type: "bytes", internalType: "bytes" },
      { name: "allowSideEffects", type: "bool", internalType: "bool" },
      { name: "tryPrepare", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isValidSigWithSideEffects",
    inputs: [
      { name: "_signer", type: "address", internalType: "address" },
      { name: "_hash", type: "bytes32", internalType: "bytes32" },
      { name: "_signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lookup",
    inputs: [{ name: "wallet", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "result", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownershipHandoverExpiresAt",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "result", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "resolve",
    inputs: [
      { name: "response", type: "bytes", internalType: "bytes" },
      { name: "extraData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "document", type: "string", internalType: "string" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "url",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "IdentifierCreated",
    inputs: [
      {
        name: "wallet",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "identity",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverCanceled",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverRequested",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "oldOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  {
    type: "error",
    name: "ERC1271Revert",
    inputs: [{ name: "error", type: "bytes", internalType: "bytes" }],
  },
  {
    type: "error",
    name: "ERC6492CallFailed",
    inputs: [{ name: "error", type: "bytes", internalType: "bytes" }],
  },
  { type: "error", name: "ERC6492DeploySilentlyFailed", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  {
    type: "error",
    name: "OffchainLookup",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "urls", type: "string[]", internalType: "string[]" },
      { name: "callData", type: "bytes", internalType: "bytes" },
      { name: "callbackFunction", type: "bytes4", internalType: "bytes4" },
      { name: "extraData", type: "bytes", internalType: "bytes" },
    ],
  },
  {
    type: "error",
    name: "StringsInsufficientHexLength",
    inputs: [
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "length", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Unauthorized", inputs: [] },
] as const;
