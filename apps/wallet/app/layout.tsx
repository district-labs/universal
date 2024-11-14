import './globals.css';

import { env } from '@/env';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/toaster';
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
  openGraph: {
    type: 'website',
    url: new URL('/', url).toString(),
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    images: [
      {
        url: new URL('/opengraph-image.png', url).toString(),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} OpenGraph Image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: new URL('/', url).toString(),
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    images: [new URL('/opengraph-image.png', url).toString()],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Toaster />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
