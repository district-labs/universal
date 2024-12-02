'use client';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { Card } from '../ui/card';
import { LinkComponent } from '../ui/link-component';
import { SidebarTrigger } from '../ui/sidebar';
import { mobileMenu } from './app-mobile-menu-items';

type MobileMenu = React.HTMLAttributes<HTMLElement>;

export const MobileMenu = ({ className }: MobileMenu) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-20 flex items-center justify-center gap-x-12 border-2 bg-white p-4 pb-7 md:hidden',
        className,
      )}
    >
      {mobileMenu.map((item, index) => {
        const isActive = pathname === item.url;
        if (index === 2) {
          return (
            <>
              <div className="">
                <SidebarTrigger className="size-9">
                  <Card className="p-4">
                    <Menu className="size-5" />
                  </Card>
                </SidebarTrigger>
              </div>
              <LinkComponent
                key={item.url}
                href={item.url}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-1 hover:text-emerald-600',
                  isActive && 'text-emerald-600',
                )}
              >
                <item.icon />
              </LinkComponent>
            </>
          );
        }
        return (
          <LinkComponent
            key={item.url}
            href={item.url}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1 hover:text-emerald-600',
              isActive && 'text-emerald-600',
            )}
          >
            <item.icon />
          </LinkComponent>
        );
      })}
    </div>
  );
};
