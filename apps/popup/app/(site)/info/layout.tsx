'use client';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();

  function previousPage() {
    router.back();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all text-center py-4',
        )}
      >
        <div className="w-full flex justify-between items-center px-4">
          <span className="p-1 hover:bg-neutral-100 cursor-pointer rounded-lg">
            <ArrowLeft className="size-5 mx-auto" onClick={previousPage} />
          </span>
          <div className="flex items-center gap-x-2"></div>
        </div>
      </header>
      <main className="flex flex-1 flex-col justify-center z-10 relative h-full">
        {children}
      </main>
    </div>
  );
}
