import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useQuery } from '@tanstack/react-query';
import type { CallParameters } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import {
  type AssetType,
  simulateUserOpAssetChanges,
} from '../actions/simulate-user-op-asset-changes';

export function useEstimateUserOpAssetChanges({
  calls: defaultCalls,
}: {
  calls?: CallParameters[];
}) {
  const { message } = useMessageContext();
  const { accountState } = useAccountState();
  const bundlerClient = useBundlerClient();

  const messageCalls = message?.params?.[0]?.calls;
  const calls = defaultCalls ?? messageCalls;
  const txParams = message?.params?.[0]?.data
    ? message?.params?.[0]
    : undefined;

  const isValidCalls = Boolean(
    calls && Array.isArray(calls) && calls.length > 0,
  );
  const isValidTxParams = Boolean(txParams?.data && txParams?.to);

  const isValidParams = Boolean(
    // Should have either calls or txParams
    (isValidCalls || isValidTxParams) && accountState && bundlerClient,
  );

  return useQuery({
    queryKey: ['estimate-user-op-asset-changes', calls, txParams],
    queryFn: async () => {
      if (!isValidParams || !accountState || !bundlerClient) {
        return null;
      }

      const { credentialId, publicKey } = accountState;

      const owner = toWebAuthnAccount({
        credential: {
          id: credentialId,
          publicKey: publicKey,
        },
      });

      const account = await toUniversalAccount({
        client: bundlerClient.client,
        owners: [owner],
      });

      const preparedUserOp = await bundlerClient.prepareUserOperation({
        account,
        calls: isValidCalls ? calls : [txParams],
      });

      const simulatedAssetChanges =
        await simulateUserOpAssetChanges(preparedUserOp);

      if (!simulatedAssetChanges) {
        throw new Error('Failed to simulate asset changes');
      }

      const filterAssetsByType = (type: AssetType) =>
        simulatedAssetChanges.filter(({ assetType }) => assetType === type);

      return {
        erc721assets: filterAssetsByType('ERC721'),
        erc1155assets: filterAssetsByType('ERC1155'),
        erc20assets: filterAssetsByType('ERC20'),
      };
    },
  });
}
