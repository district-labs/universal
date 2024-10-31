import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { useQuery } from '@tanstack/react-query';
import { simulateUserOpAssetChanges } from '../actions/simulate-user-op-asset-changes';
import { getErc721Metadata } from '@/lib/web3/get-erc721-metadata';
import { baseSepolia } from 'viem/chains';
import { Address } from 'viem';

export function useEstimateUserOpAssetChanges() {
  const { message } = useMessageContext();
  const { accountState } = useAccountState();
  const bundlerClient = useBundlerClient();

  const calls = message?.params?.[0]?.calls;
  const txParams = message?.params?.[0]?.data
    ? message?.params?.[0]
    : undefined;

  const isValidCalls = Boolean(
    calls && Array.isArray(calls) && calls.length > 0,
  );
  const isValidTxParams = Boolean(txParams && txParams?.data && txParams?.to);

  const isValidParams = Boolean(
    // Should have either calls or txParams
    (isValidCalls || isValidTxParams) && accountState && bundlerClient,
  );

  return useQuery({
    queryKey: ['estimate-user-op-asset-changes', calls, txParams],
    queryFn: async () => {
      if (!isValidParams) {
        return null;
      }

      const { credentialId, publicKey } = accountState!;

      const owner = toWebAuthnAccount({
        credential: {
          id: credentialId,
          publicKey: publicKey,
        },
      });

      const account = await toUniversalAccount({
        client: bundlerClient!.client,
        owners: [owner],
      });

      const preparedUserOp = await bundlerClient!.prepareUserOperation({
        account,
        calls: isValidCalls ? calls : [txParams],
      });

      const simulatedAssetChanges =
        await simulateUserOpAssetChanges(preparedUserOp);

      const erc721Assets = simulatedAssetChanges?.filter(
        (asset) => asset.assetType === 'ERC721',
      );

      return simulatedAssetChanges;
    },
  });
}
