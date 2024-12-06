import { env } from '@/env';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import type { ValidChain } from 'universal-data';
import { http } from 'viem';
import {
  createBundlerClient,
  createPaymasterClient,
  entryPoint07Address,
} from 'viem/account-abstraction';
import { base, baseSepolia } from 'viem/chains';
import { basePublicClient, baseSepoliaPublicClient } from './public-client';

function getBundlerUrl(chain: ValidChain) {
  return `/api/bundler/${chain.id}`;
}

const pimlicoBaseUrl = `https://api.pimlico.io/v2/8453/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`;

const pimlicoBaseClient = createPimlicoClient({
  transport: http(pimlicoBaseUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: '0.7',
  },
});

export const baseBundlerClient = createBundlerClient({
  client: basePublicClient,
  chain: base,
  transport: http(getBundlerUrl(base)),
  paymaster: createPaymasterClient({
    transport: http(getBundlerUrl(base)),
  }),
  userOperation: {
    estimateFeesPerGas: async () => {
      return (await pimlicoBaseClient.getUserOperationGasPrice()).fast;
    },
  },
});

export const baseSepoliaBundlerClient = createBundlerClient({
  client: baseSepoliaPublicClient,
  chain: baseSepolia,
  transport: http(getBundlerUrl(baseSepolia)),
  paymaster: createPaymasterClient({
    transport: http(getBundlerUrl(baseSepolia)),
  }),
});

export function getBundlerClient({
  chainId,
}: {
  chainId: ValidChain['id'];
}) {
  switch (chainId) {
    case base.id:
      return baseBundlerClient;
    case baseSepolia.id:
      return baseSepoliaBundlerClient;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
