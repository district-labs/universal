import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useAccountState } from '@/lib/state/use-account-state';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Hex, fromHex } from 'viem';
import { toWebAuthnAccount } from 'viem/account-abstraction';

export function useSignMessage() {
  const { accountState } = useAccountState();
  const { message } = useMessageContext();
  const { sessionState } = useSessionState();
  const bundlerClient = useBundlerClient();

  const messageHash: Hex | undefined = message?.params?.[0];

  const formattedMessage = useMemo(() => {
    if (!messageHash) {
      return;
    }
    try {
      const messageParsed = JSON.parse(fromHex(messageHash, 'string'));
      return JSON.stringify(messageParsed, null, 2);
    } catch {
      return fromHex(messageHash, 'string');
    }
  }, [messageHash]);

  const params = { accountState, message, sessionState, bundlerClient };

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['sign-message'],
    mutationFn: async () => {
      if (!validateMessageParams(params) || !messageHash) {
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

      const signature = await account.signMessage({
        message: {
          raw: messageHash,
        },
      });

      sendMessageToOpener({
        value: signature,
        requestId: message.requestId,
        ownPrivateKey: sessionState.sessionPrivateKey,
        ownPublicKey: sessionState.sessionPublicKey,
        peerPublicKey: message.sender,
      });
    },
  });

  const isValid = validateMessageParams(params);

  return {
    signMessage: isValid ? mutate : undefined,
    signMessageAsync: isValid ? mutateAsync : undefined,
    formattedMessage,
    messageHash,
    ...rest,
  };
}
