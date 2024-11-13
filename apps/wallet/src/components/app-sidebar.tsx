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
} from '@/components/ui/sidebar';
import { siteConfig } from 'app/config';
import {
  CircleIcon,
  Earth,
  Fingerprint,
  FlaskConical,
  SmartphoneNfc,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import {
  itemsCore,
  itemsFinance,
  itemsIdentity,
  itemsTesting,
} from './app-sidebar-menu-items';
import { PWAInstallPrompt } from './pwa-install-prompt';
import { LinkComponent } from './ui/link-component';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center">
          <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
          <span className="ml-2 hidden font-semibold text-lg lg:inline-block">
            {siteConfig.name}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Dashboard</SidebarGroupLabel>
          <SidebarGroupAction>
            <Earth /> <span className="sr-only">Core</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsCore.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={true}>
                    <LinkComponent href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Finance</SidebarGroupLabel>
          <SidebarGroupAction>
            <SmartphoneNfc /> <span className="sr-only">Identity</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsFinance.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={true}>
                    <LinkComponent href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Identity</SidebarGroupLabel>
          <SidebarGroupAction>
            <Fingerprint /> <span className="sr-only">Identity</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsIdentity.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={true}>
                    <LinkComponent href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <hr className="my-1" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Testing</SidebarGroupLabel>
          <SidebarGroupAction>
            <FlaskConical /> <span className="sr-only">Testing</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsTesting.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={true}>
                    <LinkComponent href={item.url}>
                      {/* {item.icon && <item.icon />} */}
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
            <div className="curs flex w-full items-center justify-between">
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
        <div className="flow-row flex items-center gap-x-2 border-t-2 p-4">
          <div className="flex-1">
            <LinkComponent
              className="font-semibold text-xs"
              href="https://github.com/district-labs/"
            >
              Github
            </LinkComponent>
          </div>
          <div className="">
            <span className="text-xs">version 0.0.0</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
