import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ConnectButton } from '@/components/onchain/connect-button';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <header
              className={cn(
                'top-0 z-50 w-full border-b-2 bg-background text-foreground transition-all',
              )}
            >
              <div className="flex w-full justify-between items-center py-4 px-4">
                <SidebarTrigger className="size-9" />
                <ConnectButton rounded={'full'} />
              </div>
            </header>
            <main className="flex flex-1 flex-col z-10 relative">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
