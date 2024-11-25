import type { DelegationsApi } from 'api-delegations';
import { hc } from 'hono/client';
// DelegationsApiClientContext.tsx
import { type ReactNode, createContext, useContext } from 'react';

export type DelegationsApiClient = ReturnType<typeof hc<DelegationsApi>>;

// Create the context with a default value of null
const DelegationsApiClientContext = createContext<DelegationsApiClient | null>(
  null,
);

interface DelegationsApiClientProviderProps {
  url: string;
  children: ReactNode;
}

// Provider component
export function DelegationsApiClientProvider({
  url,
  children,
}: DelegationsApiClientProviderProps) {
  // Create the client instance
  const client = hc<DelegationsApi>(url);

  return (
    <DelegationsApiClientContext.Provider value={client}>
      {children}
    </DelegationsApiClientContext.Provider>
  );
}

// Custom hook to use the client
export function useDelegationsApiClient(): DelegationsApiClient {
  const context = useContext(DelegationsApiClientContext);
  if (!context) {
    throw new Error(
      'useDelegationsApiClient must be used within a DelegationsApiClientProvider',
    );
  }
  return context;
}
