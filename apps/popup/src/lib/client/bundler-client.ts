import type { Chain } from '@/types';
import { http } from 'viem';
import {
  createBundlerClient,
  createPaymasterClient,
} from 'viem/account-abstraction';
import { base, baseSepolia } from 'viem/chains';
import { basePublicClient, baseSepoliaPublicClient } from './public-client';

function getBundlerUrl(chain: Chain) {
  return `/api/bundler/${chain.id}`;
}

export const baseBundlerClient = createBundlerClient({
  client: basePublicClient,
  chain: base,
  transport: http(getBundlerUrl(base)),
  paymaster: createPaymasterClient({
    transport: http(getBundlerUrl(base)),
  }),
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
