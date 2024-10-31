import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CircleIcon } from 'lucide-react';
import { siteConfig } from 'app/config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
          <div className="px-6 grid grid-cols-12 lg:grid-cols-12 w-full justify-between items-center py-4">
            <div className="col-span-2 lg:col-span-6">
              <Link href="/" className="flex items-center">
                <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
                <span className="ml-2 text-lg font-semibold hidden lg:inline-block">
                  {siteConfig.name}
                </span>
              </Link>
            </div>
            <div className="flex-1 flex items-center space-x-2 justify-end lg:col-span-6 col-span-10">
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
        <main className="flex flex-1 flex-col justify-center z-10 relative">
          {children}
        </main>
        <footer className="grid w-full grid-cols-1 gap-y-5 px-10 pb-8 pt-6 border-t-2 z-50 relative dark:border-neutral-600"></footer>
      </div>
    </>
  );
}
