import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { siteConfig } from 'app/config';
import { CircleIcon, MenuIcon } from 'lucide-react';
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
          <div className="grid w-full grid-cols-3 items-center justify-between px-6 py-4">
            <div className="col-span-1 flex items-center">
              <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
            </div>
            <div className="col-span-1 flex items-center justify-end ">
              <Sheet>
                <SheetTrigger asChild={true}>
                  <span className="cursor-pointer rounded-lg px-2 py-1 text-xs hover:bg-neutral-100">
                    <MenuIcon className="size-6" />
                  </span>
                </SheetTrigger>
                <SheetContent className="h-full w-full" side={'bottom'}>
                  <SheetHeader>
                    <SheetTitle className="font-bold text-3xl">
                      Universal Wallet
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col gap-y-4">
                    <p className="text-center text-normal">
                      Discover What's Possible
                    </p>
                    <p className="text-center text-xs">
                      Secure your digital assets. <br /> Own your digital
                      identity. <br /> Connect with the world.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        <main className="relative z-10 flex flex-1 flex-col justify-center">
          {children}
        </main>
        <footer className="relative z-50 flex items-center justify-between border-t-2 px-3 py-3 text-center dark:border-neutral-600">
          <span className="ml-2 font-bold text-xs">{siteConfig.company}</span>
          <span className="flex items-start gap-x-1 text-xs">
            <Link
              target="blank"
              href="https://www.districtlabs.com/terms-of-service"
            >
              Terms of Service
            </Link>
            |
            <Link
              target="blank"
              href="https://www.districtlabs.com/privacy-policy"
            >
              Privacy Policy
            </Link>
          </span>
        </footer>
      </div>
    </>
  );
}
