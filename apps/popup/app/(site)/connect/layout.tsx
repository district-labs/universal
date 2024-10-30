import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CircleIcon, MenuIcon } from 'lucide-react';
import { siteConfig } from 'app/config';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
          <div className="px-6 grid grid-cols-3 w-full justify-between items-center py-4">
            <div className="col-span-1 flex items-center">
              <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center"></div>
            <div className="col-span-1 flex items-center justify-end ">
              <Sheet>
                <SheetTrigger asChild={true}>
                  <span className="px-2 py-1 hover:bg-neutral-100 rounded-lg cursor-pointer text-xs">
                    <MenuIcon className="size-6" />
                  </span>
                </SheetTrigger>
                <SheetContent className="w-full h-full">
                  <SheetHeader>
                    <SheetTitle>Information</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-y-4 mt-4">
                    {/* <Button className='w-full'>Onchain</Button> */}
                    <Link href="/info/actions">
                      <Button variant={'outline'} className="w-full">
                        Actions
                      </Button>
                    </Link>
                    <Button variant={'outline'} className="w-full">
                      Identity
                    </Button>
                    <Button variant={'outline'} className="w-full">
                      Permissions
                    </Button>
                    <p className="text-center text-xs">
                      Universal Wallet is designed to make your digital life
                      better.
                    </p>
                    <p className="text-center text-xs">
                      Control your digital assets, identity, and relationships
                      with ease.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col justify-center z-10 relative">
          {children}
        </main>
        <footer className="px-3 py-3 border-t-2 z-50 relative dark:border-neutral-600 text-center flex items-center justify-between">
          <span className="ml-2 text-xs font-bold">{siteConfig.company}</span>
          <span className="text-xs flex items-start gap-x-1">
            <Link
              target="blank"
              href="https://www.districtlabs.xyz/terms-of-service"
            >
              Terms of Service
            </Link>
            |
            <Link
              target="blank"
              href="https://www.districtlabs.xyz/terms-of-service"
            >
              Privacy Policy
            </Link>
          </span>
        </footer>
      </div>
    </>
  );
}
