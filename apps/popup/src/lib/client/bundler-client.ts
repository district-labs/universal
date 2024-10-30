import type { Chain } from '@/types';
import {
  createBundlerClient,
  createPaymasterClient,
} from 'viem/account-abstraction';
import { basePublicClient, baseSepoliaPublicClient } from './public-client';
import { base, baseSepolia } from 'viem/chains';
import { http } from 'viem';
import { env } from '@/env';

export const baseBundlerClient = createBundlerClient({
  client: basePublicClient,
  chain: base,
  transport: http(
    `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
  ),
  paymaster: createPaymasterClient({
    transport: http(
      `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
    ),
  }),
});

export const baseSepoliaBundlerClient = createBundlerClient({
  client: baseSepoliaPublicClient,
  chain: baseSepolia,
  transport: http(
    `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
  ),
  paymaster: createPaymasterClient({
    transport: http(
      `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
    ),
  }),
});

export function getBundlerClient({
  chainId,
}: {
  chainId: Chain['id'];
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
