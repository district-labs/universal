import { useAccountState } from '@/lib/state/use-account-state';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useState } from 'react';

export function useSendTransaction() {
  const [isLoadingUserOp, setIsLoadingUserOp] = useState(false);
  const [isLoadingSendTx, setIsLoadingSendTx] = useState(false);
  const { accountState } = useAccountState();
  const { message } = useMessageContext();
  const { sessionState } = useSessionState();
  const bundlerClient = useBundlerClient();

  // TODO: Type check tx params
  const txParams = message?.params[0];
  const params = { accountState, message, sessionState, bundlerClient };

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
          calls: [txParams],
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
    txParams,
    isLoadingSendTx,
    isLoadingUserOp,
    ...rest,
  };
}
