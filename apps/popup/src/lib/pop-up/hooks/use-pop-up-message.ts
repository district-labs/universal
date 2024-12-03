import { type ValidChain, productionChains } from 'universal-data';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';
import { useAccountState } from '@/lib/state/use-account-state';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  decryptContent,
  deriveSharedSecret,
  importKeyFromHexString,
} from 'universal-wallet-sdk';

const unsupportedMethodUrl = '/unsupported-method';

// biome-ignore lint/suspicious/noExplicitAny: any
function getMethodRoutes(message: { method: string; params: any } | undefined) {
  if (!message) {
    return;
  }
  const { method, params } = message;

  const methodRoutes: Record<string, string> = {
    eth_requestAccounts: '/sign/eth-request-accounts',
    personal_sign: '/sign/personal-sign',
    eth_signTypedData_v4: '/sign/eth-sign-typed-data-v-4',
    wallet_sendCalls: '/sign/wallet-send-calls',
    eth_sendTransaction: '/sign/eth-send-transaction',
    wallet_showCallsStatus: `/transaction/calls-submitted/${String(params[0])}`,

    // Unsupported methods
    eth_signTransaction: unsupportedMethodUrl,
    eth_signTypedData_v1: unsupportedMethodUrl,
    eth_signTypedData_v3: unsupportedMethodUrl,
    eth_signTypedData: unsupportedMethodUrl,
    eth_ecRecover: unsupportedMethodUrl,
    wallet_addEthereumChain: unsupportedMethodUrl,
    wallet_watchAsset: unsupportedMethodUrl,
    wallet_grantPermissions: unsupportedMethodUrl,
  };

  return methodRoutes?.[method];
}

/**
 * Custom hook for dealing with the pop-up messaging flow.
 * It contains hooks and effects for managing the pop-up message.
 * @returns
 */
export function usePopUpMessage() {
  // State
  const [messageQueue, setMessageQueue] = useState<MessageEvent[]>([]);
  const processingRef = useRef(false);
  const router = useRouter();
  const { accountState } = useAccountState();
  const { message, setMessage } = useMessageContext();
  const { sessionState } = useSessionState();

  // Callbacks
  const receiveMessage = useCallback((m: MessageEvent) => {
    if (m.source === window.opener) {
      setMessageQueue((prevQueue) => [...prevQueue, m]);
    }
  }, []);

  const processMessageQueue = useCallback(async () => {
    if (processingRef.current || messageQueue.length === 0) {
      return;
    }

    processingRef.current = true;
    const message = messageQueue[0];

    if (
      message.source === window.opener &&
      message?.data?.content?.encrypted &&
      sessionState?.sessionPrivateKey
    ) {
      const [ownPrivateKey, peerPublicKey] = await Promise.all([
        importKeyFromHexString('private', sessionState.sessionPrivateKey),
        importKeyFromHexString('public', message?.data?.sender),
      ]);

      const sharedSecret = await deriveSharedSecret(
        ownPrivateKey,
        peerPublicKey,
      );

      const response = await decryptContent(
        message?.data?.content?.encrypted,
        sharedSecret,
      );

      // @ts-expect-error
      const chainId = response?.chainId;

      // @ts-expect-error
      if (response?.action && typeof chainId === 'number') {
        // @ts-expect-error
        const { method, params } = response.action;

        setMessage({
          method,
          params,
          chainId: chainId as ValidChain['id'],
          origin: message.origin,
          requestId: message?.data?.id,
          sender: message?.data?.sender,
        });
      }
    }

    if (
      message.source === window.opener &&
      message?.data?.content?.handshake?.method
    ) {
      const { method, params } = message.data.content.handshake;
      const { id, sender } = message.data;

      setMessage({
        method,
        params,
        origin: message.origin,
        // No chainId for handshake, so using the first chainId of production chains
        chainId: productionChains[0].id,
        requestId: id,
        sender,
      });
    }

    setMessageQueue((prevQueue) => prevQueue.slice(1));
    processingRef.current = false;
  }, [messageQueue, sessionState, setMessage]);

  // Effects
  useEffect(() => {
    processMessageQueue();
  }, [processMessageQueue]);

  useEffect(() => {
    window.addEventListener('message', receiveMessage, false);
    window.addEventListener('beforeunload', closePopup, false);

    const message = { event: 'PopupLoaded' };
    window.opener.postMessage(message, '*');

    return () => {
      window.removeEventListener('message', receiveMessage);
      window.removeEventListener('beforeunload', closePopup);
    };
  }, [receiveMessage]);

  // Change routes based on the message method
  useEffect(() => {
    const route = getMethodRoutes(message);
    // If there's no account state or no route for the method, return
    if (!accountState || !route) {
      return;
    }
    router.push(route);
  }, [accountState, message, router.push]);

  return {
    message,
    messageQueue,
    setMessageQueue,
    closePopup,
  };
}
