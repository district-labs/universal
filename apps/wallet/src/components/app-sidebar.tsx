import {
  CircleIcon,
  Earth,
  Fingerprint,
  FlaskConical,
  SmartphoneNfc,
} from 'lucide-react';
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

import Link from 'next/link';
import { LinkComponent } from './ui/link-component';
import {
  itemsCore,
  itemsFinance,
  itemsIdentity,
  itemsTesting,
} from './app-sidebar-menu-items';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center">
          <CircleIcon className="size-6 text-emerald-500 dark:text-emerald-100" />
          <span className='ml-2 hidden font-semibold text-lg lg:inline-block'>
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
      <SidebarFooter className='border-t-2 p-4'>
        <div className='flow-row flex items-center gap-x-2'>
          <LinkComponent
            className='font-bold text-xs'
            href="https://github.com/district-labs/"
          >
            Github
          </LinkComponent>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
