import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { generateKeyPair, exportKeyToHexString } from 'universal-wallet-sdk';

export type SessionState =
  | {
      clientPublicKey?: string;
      sessionPrivateKey?: string;
      sessionPublicKey?: string;
    }
  | undefined;

export type UseSessionStateReturnType = ReturnType<typeof useSessionState>;

export function useSessionState() {
  const [sessionState, setSessionState, removeSessionState] =
    useLocalStorage<SessionState>('sessionState', undefined);

  async function generateSessionKeys(session: SessionState) {
    // Generate a new session key pair
    const sessionKeyPair = await generateKeyPair();
    const [sessionPrivateKey, sessionPublicKey] = await Promise.all([
      exportKeyToHexString('private', sessionKeyPair.privateKey),
      exportKeyToHexString('public', sessionKeyPair.publicKey),
    ]);

    setSessionState({
      ...session,
      sessionPrivateKey,
      sessionPublicKey,
    });
  }

  // If there's no sessionPrivateKey and sessionPublicKey, generate a new one
  useEffect(() => {
    if (!sessionState?.sessionPrivateKey || !sessionState?.sessionPublicKey) {
      generateSessionKeys(sessionState).catch(console.error);
    }
  }, [sessionState?.sessionPrivateKey, sessionState?.sessionPublicKey]);

  return {
    sessionState,
    setSessionState,
    removeSessionState,
  };
}
