import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { TypedDataDefinition } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { deserialize } from 'wagmi';

export function useSignTypedDataV4() {
  const { accountState } = useAccountState();
  const { message } = useMessageContext();
  const { sessionState } = useSessionState();
  const bundlerClient = useBundlerClient();

  const typedData: TypedDataDefinition | undefined = useMemo(
    () =>
      message?.params[1]
        ? (deserialize(message?.params[1]) as TypedDataDefinition)
        : undefined,
    [message?.params],
  );

  const params = { accountState, message, sessionState, bundlerClient };
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['sign-typed-data-v4'],
    mutationFn: async () => {
      if (!validateMessageParams(params) || !typedData) {
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

      const signature = await account.signTypedData(typedData);

      sendMessageToOpener({
        value: signature,
        requestId: message.requestId,
        ownPrivateKey: sessionState.sessionPrivateKey,
        ownPublicKey: sessionState.sessionPublicKey,
        peerPublicKey: message.sender,
      });
    },
  });

  const isValid = validateMessageParams(params) && !!typedData;

  return {
    signTypedDataV4: isValid ? mutate : undefined,
    signTypedDataV4Async: isValid ? mutateAsync : undefined,
    typedData,
    ...rest,
  };
}
