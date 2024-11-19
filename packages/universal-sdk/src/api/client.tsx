import type { App, UniversalApiClient } from 'api-universal';
import { hc } from 'hono/client';
import { type ReactNode, createContext, useContext } from 'react';
import { DelegationsApiClientProvider } from 'universal-delegations-sdk';
import { UniversalIdentityClientProvider } from 'universal-identity-sdk';

// Create the context with a default value of null
const UniversalContext = createContext<UniversalApiClient | null>(null);

interface UniversalProviderProps {
  apiUniversal: string;
  apiDelegations: string;
  apiIdentity: string;
  children: ReactNode;
}

// Provider component
export function UniversalProvider({
  children,
  apiUniversal,
  apiDelegations,
  apiIdentity,
}: UniversalProviderProps) {
  const client = hc<App>(apiUniversal);

  return (
    <UniversalContext.Provider value={client}>
      <UniversalIdentityClientProvider url={apiIdentity}>
        <DelegationsApiClientProvider url={apiDelegations}>
          {children}
        </DelegationsApiClientProvider>
      </UniversalIdentityClientProvider>
    </UniversalContext.Provider>
  );
}

// Custom hook to use the client
export function useUniversal(): UniversalApiClient {
  const context = useContext(UniversalContext);
  if (!context) {
    throw new Error('useUniversal must be used within a UniversalProvider');
  }
  return context;
}
