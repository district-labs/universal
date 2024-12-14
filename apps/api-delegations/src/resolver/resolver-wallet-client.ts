import type { ValidChain } from 'universal-data';
import { createWalletClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { env } from '../env.js';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(env.RESOLVER_PRIVATE_KEY);

const resolverWalletClientBase = createWalletClient({
  account,
  chain: base,
  transport: http(env.RPC_URL_BASE),
});

const resolverWalletClientBaseSepolia = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(env.RPC_URL_BASE_SEPOLIA),
});

export function getResolverWalletClient(chainId: ValidChain['id']) {
  switch (chainId) {
    case base.id:
      return resolverWalletClientBase;
    case baseSepolia.id:
      return resolverWalletClientBaseSepolia;
    default:
      throw new Error(`Invalid chainId: ${chainId}`);
  }
}
