'use client';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { LinkComponent } from '../ui/link-component';
import { mobileMenu } from './app-mobile-menu-items';

type MobileMenu = React.HTMLAttributes<HTMLElement>;

export const MobileMenu = ({ className }: MobileMenu) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-20 flex items-center justify-center gap-x-8 border-2 bg-white p-4 pb-5 md:hidden',
        className,
      )}
    >
      {mobileMenu.map((item) => {
        const isActive = pathname === item.url;
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
            <span className="text-xs">{item.title}</span>
          </LinkComponent>
        );
      })}
    </div>
  );
};
