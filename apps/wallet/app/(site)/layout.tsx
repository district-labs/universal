import { AppSidebar } from '@/components/app-sidebar';
import { ConnectButton } from '@/components/onchain/connect-button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <header
              className={cn(
                'top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all',
              )}
            >
              <div className="flex w-full items-center justify-between px-4 py-4">
                <SidebarTrigger className="size-9" />
                <ConnectButton rounded={'full'} />
              </div>
            </header>
            <main className="relative z-10 flex flex-1 flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
