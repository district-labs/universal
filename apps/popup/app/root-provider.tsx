'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { MessageProvider } from '@/lib/state/use-message-context';
import { ThemeProvider } from 'next-themes';

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
