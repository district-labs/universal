// UniversalIdentityClientContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import { hc } from "hono/client";
import type { AppRouter, UniversalIdentityApiClient } from "api-identity";

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
	const client = hc<AppRouter>(url);

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
			"useUniversalIdentityClient must be used within a UniversalIdentityClientProvider",
		);
	}
	return context;
}
