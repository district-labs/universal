import { env } from '@/env';
import { isValidChain } from 'universal-data';
import { type Address, type Hex, toHex } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { base, baseSepolia } from 'viem/chains';

export type AssetType = 'NATIVE' | 'ERC20' | 'ERC721' | 'ERC1155';
export type ChangeType = 'APPROVE' | 'TRANSFER';

export type Change = {
  assetType: AssetType;
  changeType: ChangeType;
  from: string;
  to: string;
  rawAmount: string;
  contractAddress: string;
  tokenId: string;
  decimals: number;
  symbol: string;
  name: string;
  amount: string;
};

type SimulateUserOpAssetChangesResponse = {
  jsonrpc: string;
  id: number;
  result: {
    changes?: Change[];
    error: {
      code: number;
      message: string;
    } | null;
  };
};

type SimulateUserOpAssetChangesParams = {
  paymaster?: Hex;
  signature: Hex;
  paymasterPostOpGasLimit?: bigint;
  paymasterVerificationGasLimit?: bigint;
  maxPriorityFeePerGas: bigint;
  maxFeePerGas: bigint;
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
  callData: Hex;
  factory?: Address;
  factoryData?: Hex;
  nonce: bigint;
  sender: Address;
  paymasterData?: Hex;
};

function getAlchemyEndpoint(chainId: number) {
  if (chainId === base.id && env.NEXT_PUBLIC_RPC_URL_BASE) {
    return env.NEXT_PUBLIC_RPC_URL_BASE;
  }

  if (chainId === baseSepolia.id && env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA) {
    return env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA;
  }

  if (!isValidChain(chainId)) {
    throw new Error('Chain not supported');
  }

  throw new Error('invalid alchemy configuration');
}

// TODO: Support multiple chain ids
export async function simulateUserOpAssetChanges({
  chainId,
  params,
}: { chainId: number; params: SimulateUserOpAssetChangesParams }) {
  const payload = formatPayloadParams(params);
  const alchemyEndpoint = getAlchemyEndpoint(chainId);
  const response = await fetch(alchemyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ETH price');
  }

  const parsedData =
    (await response.json()) as SimulateUserOpAssetChangesResponse;

  if (parsedData.result.error) {
    throw new Error(parsedData.result.error.message);
  }

  return parsedData.result.changes;
}

function formatPayloadParams({
  callData,
  callGasLimit,
  factory,
  factoryData,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  paymaster,
  paymasterData,
  paymasterPostOpGasLimit,
  paymasterVerificationGasLimit,
  preVerificationGas,
  verificationGasLimit,
  sender,
  signature,
}: SimulateUserOpAssetChangesParams) {
  return {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_simulateUserOperationAssetChanges',
    params: [
      {
        paymaster,
        signature,
        callData,
        factory,
        factoryData,
        sender,
        paymasterData,
        paymasterPostOpGasLimit: paymasterPostOpGasLimit
          ? toHex(paymasterPostOpGasLimit)
          : undefined,
        paymasterVerificationGasLimit: paymasterVerificationGasLimit
          ? toHex(paymasterVerificationGasLimit)
          : undefined,
        maxPriorityFeePerGas: toHex(maxPriorityFeePerGas),
        maxFeePerGas: toHex(maxFeePerGas),
        preVerificationGas: toHex(preVerificationGas),
        verificationGasLimit: toHex(verificationGasLimit),
        callGasLimit: toHex(callGasLimit),
        nonce: toHex(nonce),
      },
      entryPoint07Address,
    ],
  };
}
