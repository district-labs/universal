import { useCallback, useEffect } from 'react';
import { exportKeyToHexString, generateKeyPair } from 'universal-wallet-sdk';
import { useLocalStorage } from 'usehooks-ts';

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

  const generateSessionKeys = useCallback(
    async (session: SessionState) => {
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
    },
    [setSessionState],
  );

  // If there's no sessionPrivateKey and sessionPublicKey, generate a new one
  useEffect(() => {
    if (!sessionState || !sessionState?.sessionPublicKey) {
      generateSessionKeys(sessionState).catch(console.error);
    }
  }, [sessionState, generateSessionKeys]);

  return {
    sessionState,
    setSessionState,
    removeSessionState,
  };
}
