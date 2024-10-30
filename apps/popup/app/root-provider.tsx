'use client';

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { ThemeProvider } from 'next-themes';
import { MessageProvider } from '@/lib/state/use-message-context';

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
          {children}
        </QueryClientProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}
