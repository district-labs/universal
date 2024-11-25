import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from 'app/config';
import { CircleIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <header
          className={cn(
            'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all',
          )}
        >
          <div className="grid w-full grid-cols-12 items-center justify-between px-6 py-4 lg:grid-cols-12">
            <div className="col-span-2 lg:col-span-6">
              <Link href="/" className="flex items-center">
                <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
                <span className="ml-2 hidden font-semibold text-lg lg:inline-block">
                  {siteConfig.name}
                </span>
              </Link>
            </div>
            <div className="col-span-10 flex flex-1 items-center justify-end space-x-2 lg:col-span-6">
              <div className="flex items-center gap-x-2">
                <Link
                  href="https://github.com/district-labs/universal-smart-wallet"
                  target="_external"
                >
                  <Button
                    variant={'outline'}
                    className="rounded-full font-bold"
                  >
                    Smart Contracts
                  </Button>
                </Link>
                <Link
                  href="https://github.com/district-labs/universal-sdk"
                  target="_external"
                >
                  <Button
                    variant={'outline'}
                    className="rounded-full font-bold"
                  >
                    SDK
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="relative z-10 flex flex-1 flex-col justify-center">
          {children}
        </main>
        <footer className="relative z-50 grid w-full grid-cols-1 gap-y-5 border-t-2 px-10 pt-6 pb-8 dark:border-neutral-600"></footer>
      </div>
    </>
  );
}
