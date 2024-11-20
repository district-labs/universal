import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { siteConfig } from 'app/config';
import { CircleIcon, Earth, Fingerprint, SmartphoneNfc } from 'lucide-react';

import { type breakpoints, useBreakpoint } from '@/lib/hooks/use-breakpoint';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PWAInstallPrompt } from '../core/pwa-install-prompt';
import { LinkComponent } from '../ui/link-component';
import {
  itemsCore,
  itemsFinance,
  itemsIdentity,
} from './app-sidebar-menu-items';

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const toggleBreakpoint: keyof typeof breakpoints = 'md';
  const isToggleSidebarBreakpoint = useBreakpoint(toggleBreakpoint);
  const pathname = usePathname();

  return (
    <Sidebar className="z-50">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center">
          <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
          <span className="ml-2 font-semibold text-lg">{siteConfig.name}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {/* Dashboard Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Dashboard</SidebarGroupLabel>
          <SidebarGroupAction>
            <Earth /> <span className="sr-only">Core</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsCore.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    asChild={true}
                  >
                    <LinkComponent
                      href={item.url}
                      onClick={
                        isToggleSidebarBreakpoint ? toggleSidebar : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Finance Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Finance</SidebarGroupLabel>
          <SidebarGroupAction>
            <SmartphoneNfc /> <span className="sr-only">Finance</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsFinance.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    asChild={true}
                  >
                    <LinkComponent
                      href={item.url}
                      onClick={
                        isToggleSidebarBreakpoint ? toggleSidebar : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Identity Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Identity</SidebarGroupLabel>
          <SidebarGroupAction>
            <Fingerprint /> <span className="sr-only">Identity</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsIdentity.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    asChild={true}
                  >
                    <LinkComponent
                      href={item.url}
                      onClick={
                        isToggleSidebarBreakpoint ? toggleSidebar : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-y-0 p-0">
        <PWAInstallPrompt className="text-sm">
          <div className="bg-neutral-200/60 px-4 py-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-semibold text-neutral-600">
                Install Universal
              </span>
              <Image
                className="rounded-md shadow-md"
                src="/icon-192x192.png"
                width={18}
                height={18}
                alt="Universal Wallet"
              />
            </div>
          </div>
        </PWAInstallPrompt>
        <div className="flex items-center gap-x-2 border-t-2 p-4">
          <div className="flex-1">
            <LinkComponent
              className="font-semibold text-xs"
              href="https://districtlabs.com/"
            >
              District
            </LinkComponent>
          </div>
          <div>
            <span className="text-xs">v0.0.0-alpha</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
