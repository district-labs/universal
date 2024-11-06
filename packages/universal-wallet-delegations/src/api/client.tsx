// DelegationsApiClientContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { hc } from 'hono/client';
import type { AppRouter } from 'delegations-api';

export type DelegationsApiClient = ReturnType<typeof hc<AppRouter>>;

// Create the context with a default value of null
const DelegationsApiClientContext = createContext<DelegationsApiClient | null>(null);

interface DelegationsApiClientProviderProps {
  url: string;
  children: ReactNode;
}

// Provider component
export function DelegationsApiClientProvider({ url, children }: DelegationsApiClientProviderProps) {
  // Create the client instance
  const client = hc<AppRouter>(url);

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
    throw new Error('useDelegationsApiClient must be used within a DelegationsApiClientProvider');
  }
  return context;
}
