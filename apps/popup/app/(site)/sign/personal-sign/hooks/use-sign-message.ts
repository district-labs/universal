import { useAccountState } from '@/lib/state/use-account-state';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useMutation } from '@tanstack/react-query';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { Hex, fromHex } from 'viem';
import { useMemo } from 'react';
import { validateMessageParams } from '@/lib/pop-up/utils/validate-message-params';
import { useBundlerClient } from '@/lib/state/use-bundler-client';
import { toUniversalAccount } from '@/lib/account-abstraction/account-adapters/to-universal-account';

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
    } catch (e) {
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
