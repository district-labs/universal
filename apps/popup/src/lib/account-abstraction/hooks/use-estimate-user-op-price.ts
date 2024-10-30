import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useQuery } from '@tanstack/react-query';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { toHybridDelegatorAccount } from '../account-adapters/to-hybrid-delegator-account';
import { formatEther } from 'viem';
import { getEthPrice } from '@/lib/defi-llama/actions/get-eth-price';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useSessionState } from '@/lib/state/use-session-state';

export function useEstimateUserOpPrice() {
  const { message } = useMessageContext();
  const { accountState } = useAccountState();
  const { sessionState } = useSessionState();
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
    isValidCalls || isValidTxParams,
  );

  const params = { accountState, message, bundlerClient, sessionState };
  return useQuery({
    queryKey: ['estimate-user-op-price', calls, txParams],
    queryFn: async () => {
      if (!validateMessageParams(params) || !isValidParams) {
        return null;
      }

      const { accountState, bundlerClient } = params;
      const { credentialId, publicKey } = accountState!;

      const owner = toWebAuthnAccount({
        credential: {
          id: credentialId,
          publicKey: publicKey,
        },
      });

      const account = await toHybridDelegatorAccount({
        client: bundlerClient.client,
        owners: [owner],
      });

      const preparedUserOp = await bundlerClient.prepareUserOperation({
        account,
        calls: isValidCalls ? calls : [txParams],
      });

      const [gas, gasPrice, ethPrice] = await Promise.all([
        bundlerClient.estimateUserOperationGas(preparedUserOp),
        bundlerClient.client.getGasPrice(),
        getEthPrice(),
      ]);

      const gasEstimation =
        Number(formatEther(gas.callGasLimit * gasPrice)) * ethPrice;

      return gasEstimation;
    },

    enabled: isValidParams,
  });
}
