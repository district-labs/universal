import './globals.css';

import { env } from '@/env';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { siteConfig } from './config';
import { fontSans } from './fonts';
import RootProvider from './root-provider';

const url = env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  metadataBase: new URL(url),
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
