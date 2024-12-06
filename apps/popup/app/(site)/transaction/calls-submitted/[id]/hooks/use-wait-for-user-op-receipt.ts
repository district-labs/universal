import { getBundlerClient } from '@/lib/client/bundler-client';
import { useQuery } from '@tanstack/react-query';
import type { ValidChain } from 'universal-data';
import type { Hex } from 'viem';

export function useWaitForUserOpReceipt({
  chainId,
  hash,
}: {
  chainId: ValidChain['id'] | undefined;
  hash: Hex | undefined;
}) {
  return useQuery({
    queryKey: ['wait-for-user-op-receipt', hash, chainId],
    queryFn: () => {
      if (!chainId || !hash) {
        return null;
      }
      const bundlerClient = getBundlerClient({
        chainId,
      });
      if (!bundlerClient) {
        return null;
      }
      return bundlerClient.waitForUserOperationReceipt({
        hash,
      });
    },
    enabled: !!hash,
  });
}
