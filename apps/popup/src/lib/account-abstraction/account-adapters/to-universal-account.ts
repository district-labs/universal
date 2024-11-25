import type { Address, TypedData } from 'abitype';
import {
  type Assign,
  BaseError,
  type Client,
  type Hash,
  type Hex,
  type LocalAccount,
  type OneOf,
  type Prettify,
  type TypedDataDefinition,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  hashMessage,
  hashTypedData,
  pad,
  parseSignature,
  size,
  stringToHex,
  toPrefixedMessage,
} from 'viem';
import {
  type SmartAccount,
  type SmartAccountImplementation,
  type WebAuthnAccount,
  entryPoint07Abi,
  entryPoint07Address,
  toSmartAccount,
} from 'viem/account-abstraction';
import { readContract } from 'viem/actions';
import {
  type WebAuthnData,
  parseSignature as parseP256Signature,
} from 'webauthn-p256';
import { BATCH_EXECUTION_MODE } from '../../delegation-framework/constants';
import { encodeBatchExecution } from '../../delegation-framework/execution-lib/encode-batch-execution';
import {
  getPackedUserOperationTypedDataHash,
  getUserOperationHash,
} from '../utils';

export type ToCoinbaseSmartAccountParameters = {
  address?: Address | undefined;
  client: Client;
  owners: readonly OneOf<LocalAccount | WebAuthnAccount>[];
  nonce?: bigint | undefined;
};

export type ToCoinbaseSmartAccountReturnType = Prettify<
  SmartAccount<CoinbaseSmartAccountImplementation>
>;

export type CoinbaseSmartAccountImplementation = Assign<
  SmartAccountImplementation<
    typeof entryPoint07Abi,
    '0.7',
    {
      abi: typeof universalWalletAbi;
      factory: { abi: typeof factoryAbi; address: Address };
    }
  >,
  {
    decodeCalls: NonNullable<SmartAccountImplementation['decodeCalls']>;
    sign: NonNullable<SmartAccountImplementation['sign']>;
  }
>;

const factoryAddress = '0x6456c9F0B987b71e1c47c34F1A95aB6eED8DA2f0';

/**
 * @description Create a Universal Wallet Account.
 *
 * @param parameters - {@link ToCoinbaseSmartAccountParameters}
 * @returns Coinbase Smart Account. {@link ToCoinbaseSmartAccountReturnType}
 *
 * @example
 * import { toCoinbaseSmartAccount } from 'viem/account-abstraction'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { client } from './client.js'
 *
 * const account = toCoinbaseSmartAccount({
 *   client,
 *   owners: [privateKeyToAccount('0x...')],
 * })
 */
export async function toUniversalAccount(
  parameters: ToCoinbaseSmartAccountParameters,
): Promise<ToCoinbaseSmartAccountReturnType> {
  const { client, owners, nonce = 0n } = parameters;

  let address = parameters.address;

  const entryPoint = {
    abi: entryPoint07Abi,
    address: entryPoint07Address,
    version: '0.7',
  } as const;
  const factory = {
    abi: factoryAbi,
    address: factoryAddress,
  } as const;

  const owners_bytes = owners.map((owner) =>
    owner.type === 'webAuthn' ? owner.publicKey : pad(owner.address),
  );

  const owner = owners[0];

  return toSmartAccount({
    client,
    entryPoint,

    extend: { abi: universalWalletAbi, factory },

    async decodeCalls(data) {
      const result = decodeFunctionData({
        abi: universalWalletAbi,
        data,
      });

      if (result.functionName === 'execute') {
        if (result.args.length === 1) {
          return [
            {
              to: result.args[0].target,
              value: result.args[0].value,
              data: result.args[0].callData,
            },
          ];
        }

        throw new BaseError('executeBatch not implemented yet');
      }

      // TODO: handle executeBatch
      // biome-ignore lint/suspicious/noExplicitAny: any
      return [] as any;
    },

    async encodeCalls(calls) {
      if (calls.length === 1) {
        return encodeFunctionData({
          abi: universalWalletAbi,
          functionName: 'execute',
          args: [
            {
              target: calls[0].to,
              value: calls[0].value ?? 0n,
              callData: calls[0].data ?? '0x00',
            },
          ],
        });
      }

      if (calls.length > 1) {
        const batchExecutionCalldata = encodeBatchExecution(
          calls.map(({ to, data, value }) => ({
            target: to,
            value: value ?? 0n,
            calldata: data ?? '0x00',
          })),
        );

        return encodeFunctionData({
          abi: universalWalletAbi,
          functionName: 'execute',
          args: [BATCH_EXECUTION_MODE, batchExecutionCalldata],
        });
      }

      throw new BaseError('invalid calls');
    },

    async getAddress() {
      address ??= await readContract(client, {
        ...factory,
        functionName: 'getAddress',
        args: [owners_bytes, nonce],
      });
      return address;
    },

    async getFactoryArgs() {
      const factoryData = encodeFunctionData({
        abi: factory.abi,
        functionName: 'createAccount',
        args: [owners_bytes, nonce],
      });
      return { factory: factory.address, factoryData };
    },

    async getStubSignature() {
      if (owner.type === 'webAuthn')
        return '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001949fc7c88032b9fcb5f6efc7a7b8c63668eae9871b765e23123bb473ff57aa831a7c0d9276168ebcc29f2875a0239cffdf2a9cd1c2007c5c77c071db9264df1d000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2273496a396e6164474850596759334b7156384f7a4a666c726275504b474f716d59576f4d57516869467773222c226f726967696e223a2268747470733a2f2f7369676e2e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000';
      return wrapSignature({
        signature:
          '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
      });
    },

    async sign(parameters) {
      const signature = await sign({ hash: parameters.hash, owner });

      return wrapSignature({
        signature,
      });
    },

    async signMessage(parameters) {
      const { message } = parameters;

      const hash = hashMessage(toPrefixedMessage(message));

      const signature = await sign({ hash, owner });
      const wrappedSig = wrapSignature({
        signature,
      });

      return wrappedSig;
    },

    async signTypedData(parameters) {
      const { domain, types, primaryType, message } =
        parameters as TypedDataDefinition<TypedData, string>;

      const hash = hashTypedData({
        domain,
        message,
        primaryType,
        types,
      });

      const signature = await sign({ hash, owner });

      const wrappedSig = wrapSignature({
        signature,
      });

      return wrappedSig;
    },

    async signUserOperation(parameters) {
      const { chainId, ...userOperation } = parameters;
      const address = await this.getAddress();

      // @ts-ignore
      const packedUserOperationHash = getUserOperationHash(userOperation);

      const packedUserOpTypedHash = getPackedUserOperationTypedDataHash({
        address,
        packedUserOperationHash,
      });

      const signature = await sign({ hash: packedUserOpTypedHash, owner });
      const wrappedSig = wrapSignature({
        signature,
      });

      return wrappedSig;
    },

    userOperation: {
      async estimateGas(userOperation) {
        if (owner.type !== 'webAuthn') return;

        // Accounts with WebAuthn owner require a minimum verification gas limit of 800,000.
        return {
          verificationGasLimit: BigInt(
            Math.max(Number(userOperation.verificationGasLimit ?? 0n), 800_000),
          ),
        };
      },
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////////////////////////////////

/** @internal */
export async function sign({
  hash,
  owner,
}: { hash: Hash; owner: OneOf<LocalAccount | WebAuthnAccount> }) {
  // WebAuthn Account (Passkey)
  if (owner.type === 'webAuthn') {
    const { signature, webauthn } = await owner.sign({
      hash,
    });
    return toWebAuthnSignature({ signature, webauthn });
  }

  if (owner.sign) return owner.sign({ hash });

  throw new BaseError('`owner` does not support raw sign.');
}

/** @internal */
export function toWebAuthnSignature({
  webauthn,
  signature,
}: {
  webauthn: WebAuthnData;
  signature: Hex;
}) {
  const { r, s } = parseP256Signature(signature);
  return encodeAbiParameters(
    [
      {
        components: [
          {
            name: 'authenticatorData',
            type: 'bytes',
          },
          { name: 'clientDataJSON', type: 'bytes' },
          { name: 'challengeIndex', type: 'uint256' },
          { name: 'typeIndex', type: 'uint256' },
          {
            name: 'r',
            type: 'uint256',
          },
          {
            name: 's',
            type: 'uint256',
          },
        ],
        type: 'tuple',
      },
    ],
    [
      {
        authenticatorData: webauthn.authenticatorData,
        clientDataJSON: stringToHex(webauthn.clientDataJSON),
        challengeIndex: BigInt(webauthn.challengeIndex),
        typeIndex: BigInt(webauthn.typeIndex),
        r,
        s,
      },
    ],
  );
}

/** @internal */
export function wrapSignature(parameters: {
  ownerIndex?: number | undefined;
  signature: Hex;
}) {
  const { ownerIndex = 0 } = parameters;
  const signatureData = (() => {
    if (size(parameters.signature) !== 65) return parameters.signature;
    const signature = parseSignature(parameters.signature);
    return encodePacked(
      ['bytes32', 'bytes32', 'uint8'],
      [signature.r, signature.s, signature.yParity === 0 ? 27 : 28],
    );
  })();
  return encodeAbiParameters(
    [
      {
        components: [
          {
            name: 'ownerIndex',
            type: 'uint8',
          },
          {
            name: 'signatureData',
            type: 'bytes',
          },
        ],
        type: 'tuple',
      },
    ],
    [
      {
        ownerIndex,
        signatureData,
      },
    ],
  );
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////////////////////////////

const universalWalletAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_delegationManager',
        type: 'address',
        internalType: 'contract IDelegationManager',
      },
      {
        name: '_entryPoint',
        type: 'address',
        internalType: 'contract IEntryPoint',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'DOMAIN_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'NAME',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'PACKED_USER_OP_TYPEHASH',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addDeposit',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'addOwnerAddress',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addOwnerBytes',
    inputs: [{ name: 'owner', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addOwnerPublicKey',
    inputs: [
      { name: 'x', type: 'bytes32', internalType: 'bytes32' },
      { name: 'y', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'delegationManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IDelegationManager',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'disableDelegation',
    inputs: [
      {
        name: '_delegation',
        type: 'tuple',
        internalType: 'struct Delegation',
        components: [
          { name: 'delegate', type: 'address', internalType: 'address' },
          { name: 'delegator', type: 'address', internalType: 'address' },
          { name: 'authority', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'caveats',
            type: 'tuple[]',
            internalType: 'struct Caveat[]',
            components: [
              { name: 'enforcer', type: 'address', internalType: 'address' },
              { name: 'terms', type: 'bytes', internalType: 'bytes' },
              { name: 'args', type: 'bytes', internalType: 'bytes' },
            ],
          },
          { name: 'salt', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      { name: 'fields', type: 'bytes1', internalType: 'bytes1' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'version', type: 'string', internalType: 'string' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      { name: 'verifyingContract', type: 'address', internalType: 'address' },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: 'extensions', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'enableDelegation',
    inputs: [
      {
        name: '_delegation',
        type: 'tuple',
        internalType: 'struct Delegation',
        components: [
          { name: 'delegate', type: 'address', internalType: 'address' },
          { name: 'delegator', type: 'address', internalType: 'address' },
          { name: 'authority', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'caveats',
            type: 'tuple[]',
            internalType: 'struct Caveat[]',
            components: [
              { name: 'enforcer', type: 'address', internalType: 'address' },
              { name: 'terms', type: 'bytes', internalType: 'bytes' },
              { name: 'args', type: 'bytes', internalType: 'bytes' },
            ],
          },
          { name: 'salt', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'entryPoint',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract IEntryPoint' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [
      {
        name: '_execution',
        type: 'tuple',
        internalType: 'struct Execution',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [
      { name: '_mode', type: 'bytes32', internalType: 'ModeCode' },
      { name: '_executionCalldata', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'executeFromExecutor',
    inputs: [
      { name: '_mode', type: 'bytes32', internalType: 'ModeCode' },
      { name: '_executionCalldata', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [
      { name: 'returnData_', type: 'bytes[]', internalType: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getDeposit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getDomainHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getImplementation',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getInitializedVersion',
    inputs: [],
    outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonce',
    inputs: [{ name: '_key', type: 'uint192', internalType: 'uint192' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonce',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPackedUserOperationHash',
    inputs: [
      {
        name: '_userOp',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          { name: 'paymasterAndData', type: 'bytes', internalType: 'bytes' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getPackedUserOperationTypedDataHash',
    inputs: [
      {
        name: '_userOp',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          { name: 'paymasterAndData', type: 'bytes', internalType: 'bytes' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [{ name: 'owners', type: 'bytes[]', internalType: 'bytes[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isDelegationDisabled',
    inputs: [
      { name: '_delegationHash', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isOwnerAddress',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isOwnerBytes',
    inputs: [{ name: 'account', type: 'bytes', internalType: 'bytes' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isOwnerPublicKey',
    inputs: [
      { name: 'x', type: 'bytes32', internalType: 'bytes32' },
      { name: 'y', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isValidSignature',
    inputs: [
      { name: '_hash', type: 'bytes32', internalType: 'bytes32' },
      { name: '_signature', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: 'magicValue_', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextOwnerIndex',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onERC1155BatchReceived',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onERC1155Received',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onERC721Received',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'ownerAtIndex',
    inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ownerCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'redeemDelegations',
    inputs: [
      {
        name: '_permissionContexts',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
      { name: '_modes', type: 'bytes32[]', internalType: 'ModeCode[]' },
      {
        name: '_executionCallDatas',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeLastOwner',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      { name: 'owner', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeOwnerAtIndex',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      { name: 'owner', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removedOwnersCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: '_interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: '_newImplementation',
        type: 'address',
        internalType: 'address',
      },
      { name: '_data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'upgradeToAndCallAndRetainStorage',
    inputs: [
      {
        name: '_newImplementation',
        type: 'address',
        internalType: 'address',
      },
      { name: '_data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'validateUserOp',
    inputs: [
      {
        name: '_userOp',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          { name: 'paymasterAndData', type: 'bytes', internalType: 'bytes' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: '', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_missingAccountFunds',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      { name: 'validationData_', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawDeposit',
    inputs: [
      {
        name: '_withdrawAddress',
        type: 'address',
        internalType: 'address payable',
      },
      { name: '_withdrawAmount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AddOwner',
    inputs: [
      {
        name: 'index',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      { name: 'owner', type: 'bytes', indexed: false, internalType: 'bytes' },
    ],
    anonymous: false,
  },
  { type: 'event', name: 'ClearedStorage', inputs: [], anonymous: false },
  {
    type: 'event',
    name: 'EIP712DomainChanged',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RemoveOwner',
    inputs: [
      {
        name: 'index',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      { name: 'owner', type: 'bytes', indexed: false, internalType: 'bytes' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SentPrefund',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      { name: 'success', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetDelegationManager',
    inputs: [
      {
        name: 'newDelegationManager',
        type: 'address',
        indexed: true,
        internalType: 'contract IDelegationManager',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetEntryPoint',
    inputs: [
      {
        name: 'entryPoint',
        type: 'address',
        indexed: true,
        internalType: 'contract IEntryPoint',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TryExecuteUnsuccessful',
    inputs: [
      {
        name: 'batchExecutionindex',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'result',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AlreadyOwner',
    inputs: [{ name: 'owner', type: 'bytes', internalType: 'bytes' }],
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      { name: 'implementation', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'ExecutionFailed', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  {
    type: 'error',
    name: 'InvalidEthereumAddressOwner',
    inputs: [{ name: 'owner', type: 'bytes', internalType: 'bytes' }],
  },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  {
    type: 'error',
    name: 'InvalidOwnerBytesLength',
    inputs: [{ name: 'owner', type: 'bytes', internalType: 'bytes' }],
  },
  { type: 'error', name: 'InvalidShortString', inputs: [] },
  { type: 'error', name: 'LastOwner', inputs: [] },
  {
    type: 'error',
    name: 'NoOwnerAtIndex',
    inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
  },
  { type: 'error', name: 'NotDelegationManager', inputs: [] },
  { type: 'error', name: 'NotEntryPoint', inputs: [] },
  { type: 'error', name: 'NotEntryPointOrSelf', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  {
    type: 'error',
    name: 'NotLastOwner',
    inputs: [
      { name: 'ownersRemaining', type: 'uint256', internalType: 'uint256' },
    ],
  },
  { type: 'error', name: 'NotSelf', inputs: [] },
  {
    type: 'error',
    name: 'StringTooLong',
    inputs: [{ name: 'str', type: 'string', internalType: 'string' }],
  },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }],
  },
  { type: 'error', name: 'Unauthorized', inputs: [] },
  {
    type: 'error',
    name: 'UnsupportedCallType',
    inputs: [{ name: 'callType', type: 'bytes1', internalType: 'CallType' }],
  },
  {
    type: 'error',
    name: 'UnsupportedExecType',
    inputs: [{ name: 'execType', type: 'bytes1', internalType: 'ExecType' }],
  },
  {
    type: 'error',
    name: 'WrongOwnerAtIndex',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      { name: 'expectedOwner', type: 'bytes', internalType: 'bytes' },
      { name: 'actualOwner', type: 'bytes', internalType: 'bytes' },
    ],
  },
] as const;

const factoryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'implementation_', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'createAccount',
    inputs: [
      { name: 'owners', type: 'bytes[]', internalType: 'bytes[]' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'contract UniversalWallet',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getAddress',
    inputs: [
      { name: 'owners', type: 'bytes[]', internalType: 'bytes[]' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'implementation',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initCodeHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  { type: 'error', name: 'OwnerRequired', inputs: [] },
] as const;
