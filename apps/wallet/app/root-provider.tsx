'use client';
import '@rainbow-me/rainbowkit/styles.css';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { DelegationsApiClientProvider } from 'universal-delegations-sdk';
import { wagmiConfig } from '@/lib/wagmi/wagmi-config';
import { ThemeProvider } from 'next-themes';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { env } from '@/env';
import { UniversalIdentityClientProvider } from 'universal-identity-sdk';
const queryClient = new QueryClient();

type RootProviderProps = {
  children: ReactNode;
};

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <UniversalIdentityClientProvider
              url={env.NEXT_PUBLIC_IDENTITY_API_URL}
            >
              <DelegationsApiClientProvider
                url={env.NEXT_PUBLIC_DELEGATIONS_API_URL}
              >
                {children}
              </DelegationsApiClientProvider>
            </UniversalIdentityClientProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
