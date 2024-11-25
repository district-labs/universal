import type { IdentityApi } from 'api-identity';
import { hc } from 'hono/client';
// UniversalIdentityClientContext.tsx
import { type ReactNode, createContext, useContext } from 'react';
import type { UniversalIdentityApiClient } from '../types.js';

// Create the context with a default value of null
const UniversalIdentityClientContext =
  createContext<UniversalIdentityApiClient | null>(null);

interface UniversalIdentityClientProviderProps {
  url: string;
  children: ReactNode;
}

// Provider component
export function UniversalIdentityClientProvider({
  url,
  children,
}: UniversalIdentityClientProviderProps) {
  // Create the client instance
  const client = hc<IdentityApi>(url);

  return (
    <UniversalIdentityClientContext.Provider value={client}>
      {children}
    </UniversalIdentityClientContext.Provider>
  );
}

// Custom hook to use the client
export function useUniversalIdentityClient(): UniversalIdentityApiClient {
  const context = useContext(UniversalIdentityClientContext);
  if (!context) {
    throw new Error(
      'useUniversalIdentityClient must be used within a UniversalIdentityClientProvider',
    );
  }
  return context;
}
