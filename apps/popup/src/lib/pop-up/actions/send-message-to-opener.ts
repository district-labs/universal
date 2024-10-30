import {
  encryptContent,
  deriveSharedSecret,
  importKeyFromHexString,
} from 'universal-wallet-sdk';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';

export async function sendMessageToOpener<Value>({
  requestId,
  ownPrivateKey,
  ownPublicKey,
  peerPublicKey,
  value,
  chains,
  capabilities,
}: {
  requestId: string;
  ownPublicKey: string;
  ownPrivateKey: string;
  peerPublicKey: string;
  value: Value;
  chains?: {
    [key: number]: string;
  };
  capabilities?: Record<`0x${string}`, Record<string, unknown>>;
}) {
  const [ownPrivateKeyImported, peerPublicKeyImported] = await Promise.all([
    importKeyFromHexString('private', ownPrivateKey),
    importKeyFromHexString('public', peerPublicKey),
  ]);

  const sharedSecret = await deriveSharedSecret(
    ownPrivateKeyImported,
    peerPublicKeyImported,
  );

  if (!sharedSecret) {
    return;
  }

  let encryptPayload: {
    result: {
      value: Value;
    };
    data?: {
      chains?: {
        [key: number]: string;
      };
      capabilities?: Record<`0x${string}`, Record<string, unknown>>;
    };
  } = {
    result: {
      value,
    },
  };

  if (chains) {
    encryptPayload = {
      ...encryptPayload,
      data: {
        ...encryptPayload?.data,
        chains,
      },
    };
  }

  if (capabilities) {
    encryptPayload = {
      ...encryptPayload,
      data: {
        ...encryptPayload?.data,
        capabilities,
      },
    };
  }

  const encrypted = await encryptContent(encryptPayload, sharedSecret);

  window.opener.postMessage(
    {
      event: 'message',
      requestId,
      sender: ownPublicKey,
      content: { encrypted },
    },
    '*',
  );
  closePopup();
}
