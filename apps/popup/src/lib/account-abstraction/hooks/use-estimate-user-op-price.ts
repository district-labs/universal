import { getEthPrice } from '@/lib/defi-llama/actions/get-eth-price';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useQuery } from '@tanstack/react-query';
import { type CallParameters, formatEther } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { toUniversalAccount } from '../account-adapters/to-universal-account';

export function useEstimateUserOpPrice({
  calls: defaultCalls,
}: {
  calls?: CallParameters[];
} = {}) {
  const { message } = useMessageContext();
  const { accountState } = useAccountState();
  const { sessionState } = useSessionState();
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

      const [gas, gasPrice, ethPrice] = await Promise.all([
        bundlerClient.estimateUserOperationGas(preparedUserOp),
        bundlerClient.client.getGasPrice(),
        getEthPrice(),
      ]);

      const gasEstimation =
        Number(formatEther(gas.callGasLimit * gasPrice)) * ethPrice;

      return gasEstimation;
    },
    // Doesn't retry as we need to show an error message to the user
    retry: false,

    enabled: isValidParams,
  });
}
