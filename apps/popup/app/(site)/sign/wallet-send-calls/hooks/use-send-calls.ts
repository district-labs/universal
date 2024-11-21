import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import type { CallParameters } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import {
  formatErc20TransferEnforcerCalls,
  Erc20TransferEnforcerRedemption,
} from '@/lib/delegation-framework/enforcers/erc20-transfer-amount/format-erc20-transfer-enforcer-calls';

type UseSendCallsParams = {
  redemptions: Erc20TransferEnforcerRedemption[] | undefined;
};

export function useSendCalls({ redemptions }: UseSendCallsParams) {
  const [isLoadingUserOp, setIsLoadingUserOp] = useState(false);
  const [isLoadingSendTx, setIsLoadingSendTx] = useState(false);
  const { accountState } = useAccountState();
  const { message } = useMessageContext();
  const { sessionState } = useSessionState();
  const bundlerClient = useBundlerClient();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['send-calls'],
    mutationFn: async () => {
      if (!validateMessageParams(params) || !standardCalls) {
        return;
      }

      // Regular send calls flow
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
          console.error('Error sending calls', error);
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

  // TODO: Type check calls
  const standardCalls = message?.params[0]?.calls;
  const params = { accountState, message, sessionState, bundlerClient };
  const isValid = validateMessageParams(params) && !!standardCalls;

  const calls = useMemo(() => {
    // WIP: Credit line injection flow
    // For now always will evaluate to true, but will be updated to check if there are valid credit line delegations to be used
    let delegationCalls: CallParameters[] | undefined;
    if (redemptions && redemptions.length > 0) {
      delegationCalls = formatErc20TransferEnforcerCalls({
        redemptions,
      });
    }

    return delegationCalls && delegationCalls?.length > 0
      ? [...delegationCalls, ...standardCalls]
      : standardCalls;
  }, [standardCalls, redemptions, accountState]);

  return {
    sender: isValid ? accountState?.smartContractAddress : undefined,
    from: message?.sender,
    sendCalls: isValid ? mutate : undefined,
    sendCallsAsync: isValid ? mutateAsync : undefined,
    calls,
    isLoadingSendTx,
    isLoadingUserOp,
    ...rest,
  };
}
