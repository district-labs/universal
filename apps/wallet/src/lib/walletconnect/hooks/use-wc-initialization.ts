import { useCallback, useEffect, useState } from 'react';
import { createWalletKitClient } from '../client';

export function useWcInitialization() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      await createWalletKitClient();
      setInitialized(true);
    } catch (err: unknown) {
      console.error('Initialization failed', err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);
  return initialized;
}
