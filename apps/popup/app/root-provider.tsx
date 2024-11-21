'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { env } from '@/env';
import { MessageProvider } from '@/lib/state/use-message-context';
import { ThemeProvider } from 'next-themes';
import { UniversalProvider } from 'universal-sdk';

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
      <MessageProvider>
        <QueryClientProvider client={queryClient}>
        <UniversalProvider
              apiUniversal={env.NEXT_PUBLIC_UNIVERSAL_API_URL}
              apiDelegations={env.NEXT_PUBLIC_DELEGATIONS_API_URL}
              apiIdentity={env.NEXT_PUBLIC_IDENTITY_API_URL}
            >

          {children}
            </UniversalProvider>
        </QueryClientProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
