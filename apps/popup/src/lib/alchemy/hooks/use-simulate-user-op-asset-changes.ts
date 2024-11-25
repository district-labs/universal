import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useQuery } from '@tanstack/react-query';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { simulateUserOpAssetChanges } from '../actions/simulate-user-op-asset-changes';

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
  const isValidTxParams = Boolean(txParams?.data && txParams?.to);

  const isValidParams = Boolean(
    // Should have either calls or txParams
    (isValidCalls || isValidTxParams) && accountState && bundlerClient,
  );

  return useQuery({
    queryKey: ['estimate-user-op-asset-changes', calls, txParams],
    queryFn: async () => {
      if (!isValidParams || !bundlerClient || !accountState) {
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

      return simulateUserOpAssetChanges(preparedUserOp);
    },
  });
}
