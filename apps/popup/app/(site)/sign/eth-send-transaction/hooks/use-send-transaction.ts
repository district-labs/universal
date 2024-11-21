import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import {
  Erc20TransferEnforcerRedemption,
  formatErc20TransferEnforcerCalls,
} from '@/lib/delegation-framework/enforcers/erc20-transfer-amount/format-erc20-transfer-enforcer-calls';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { CallParameters } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';

type UseSendTransactionParams = {
  redemptions: Erc20TransferEnforcerRedemption[] | undefined;
};
export function useSendTransaction({ redemptions }: UseSendTransactionParams) {
  const [isLoadingUserOp, setIsLoadingUserOp] = useState(false);
  const [isLoadingSendTx, setIsLoadingSendTx] = useState(false);
  const { accountState } = useAccountState();
  const { message } = useMessageContext();
  const { sessionState } = useSessionState();
  const bundlerClient = useBundlerClient();

  // TODO: Type check tx params
  const txParams = message?.params[0];
  const params = { accountState, message, sessionState, bundlerClient };

  const calls = useMemo(() => {
    let delegationCalls: CallParameters[] | undefined;
    if (redemptions && redemptions.length > 0) {
      delegationCalls = formatErc20TransferEnforcerCalls({
        redemptions,
      });
    }

    return delegationCalls && delegationCalls?.length > 0
      ? [...delegationCalls, txParams]
      : [txParams];
  }, [txParams, redemptions]);

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['send-transaction'],
    mutationFn: async () => {
      if (!validateMessageParams(params) || !txParams) {
        return;
      }

      const { accountState, bundlerClient, message, sessionState } = params;
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

      setIsLoadingSendTx(true);
      const userOp = await bundlerClient
        .sendUserOperation({
          account,
          calls,
        })
        .catch((error) => {
          console.error('Error sending transaction', error);
          setIsLoadingSendTx(false);
        });
      setIsLoadingSendTx(false);

      if (!userOp) return;

      setIsLoadingUserOp(true);
      const { receipt } = await bundlerClient.waitForUserOperationReceipt({
        hash: userOp,
      });

      sendMessageToOpener({
        value: receipt.transactionHash,
        requestId: message?.requestId,
        ownPrivateKey: sessionState.sessionPrivateKey,
        ownPublicKey: sessionState.sessionPublicKey,
        peerPublicKey: message.sender,
      });
    },
  });

  const isValid = validateMessageParams(params) && !!txParams;

  return {
    sendTransaction: isValid ? mutate : undefined,
    sendTransactionAsync: isValid ? mutateAsync : undefined,
    sender: isValid ? accountState?.smartContractAddress : undefined,
    txParams,
    calls,
    isLoadingSendTx,
    isLoadingUserOp,
    ...rest,
  };
}
