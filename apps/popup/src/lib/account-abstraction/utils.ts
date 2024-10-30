import {
  type Address,
  type Hex,
  concat,
  encodeAbiParameters,
  keccak256,
  pad,
  numberToHex,
  toHex,
} from 'viem';

// Constants
const PACKED_USER_OP_TYPEHASH = keccak256(
  toHex(
    'PackedUserOperation(address sender,uint256 nonce,bytes initCode,bytes callData,bytes32 accountGasLimits,uint256 preVerificationGas,bytes32 gasFees,bytes paymasterAndData)',
  ),
);
const TYPE_HASH = keccak256(
  toHex(
    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)',
  ),
);
const hashedName = keccak256(toHex('Universal Wallet'));
const hashedVersion = keccak256(toHex('1'));

export function buildDomainSeparator({
  address,
  chainId,
}: { address: Address; chainId: number }): Hex {
  return keccak256(
    encodeAbiParameters(
      [
        {
          type: 'bytes32',
          name: 'TYPE_HASH',
        },
        {
          type: 'bytes32',
          name: 'hashedName',
        },
        {
          type: 'bytes32',
          name: 'hashedVersion',
        },
        {
          type: 'uint256',
          name: 'chainId',
        },
        {
          type: 'address',
          name: 'verifyingContract',
        },
      ],
      [TYPE_HASH, hashedName, hashedVersion, BigInt(chainId), address],
    ),
  );
}

type UserOperationParams = {
  sender: Address;
  nonce: bigint;
  chainId: number;
  callData: Hex;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  paymasterVerificationGasLimit: bigint;
  paymasterPostOpGasLimit: bigint;
  paymasterData: Hex;
  maxPriorityFeePerGas: bigint;
  factory?: Address;
  factoryData?: Hex;
  paymaster?: Address;
};

export function getUserOperationHash(params: UserOperationParams): Hex {
  const {
    sender,
    callGasLimit,
    verificationGasLimit,
    paymaster,
    callData,
    maxPriorityFeePerGas,
    maxFeePerGas,
    nonce,
    preVerificationGas,
    factory,
    factoryData,
    paymasterData,
    paymasterPostOpGasLimit,
    paymasterVerificationGasLimit,
  } = params;

  const initCode_hashed = keccak256(
    factory && factoryData ? concat([factory, factoryData]) : '0x',
  );
  const callData_hashed = keccak256(callData);
  const accountGasLimits = concat([
    pad(numberToHex(verificationGasLimit), { size: 16 }),
    pad(numberToHex(callGasLimit), { size: 16 }),
  ]);
  const gasFees = concat([
    pad(numberToHex(maxPriorityFeePerGas), { size: 16 }),
    pad(numberToHex(maxFeePerGas), { size: 16 }),
  ]);
  const paymasterAndData_hashed = keccak256(
    paymaster
      ? concat([
          paymaster,
          pad(numberToHex(paymasterVerificationGasLimit || 0), {
            size: 16,
          }),
          pad(numberToHex(paymasterPostOpGasLimit || 0), {
            size: 16,
          }),
          paymasterData || '0x',
        ])
      : '0x',
  );

  return keccak256(
    encodeAbiParameters(
      [
        { type: 'bytes32' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bytes32' },
        { type: 'bytes32' },
        { type: 'bytes32' },
        { type: 'uint256' },
        { type: 'bytes32' },
        { type: 'bytes32' },
      ],
      [
        PACKED_USER_OP_TYPEHASH,
        sender,
        nonce,
        initCode_hashed,
        callData_hashed,
        accountGasLimits,
        preVerificationGas,
        gasFees,
        paymasterAndData_hashed,
      ],
    ),
  );
}

export function getPackedUserOperationTypedDataHash({
  address,
  packedUserOperationHash,
}: {
  address: Address;
  packedUserOperationHash: Hex;
}): Hex {
  const parts: Hex[] = ['0x1901'];
  const domainSeparator = buildDomainSeparator({ address, chainId: 84532 });
  parts.push(domainSeparator);
  parts.push(packedUserOperationHash);

  return keccak256(concat(parts));
}
