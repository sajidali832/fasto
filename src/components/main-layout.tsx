'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  History,
  MessageCircle,
  Settings,
  Sparkles,
  Menu,
} from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const navItems = [
  { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
  { href: '/tools', icon: Sparkles, label: 'Tools' },
  { href: '/saved', icon: Bookmark, label: 'Saved' },
  { href: '/history', icon: History, label: 'History' },
];

const settingsItem = { href: '/settings', icon: Settings, label: 'Settings' };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const desktopLayout = (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="bg-background/80 backdrop-blur-md border-r border-border/30">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')}
                    tooltip={item.label}
                    className={cn(
                      (pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/'))
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href={settingsItem.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(settingsItem.href)}
                  tooltip={settingsItem.label}
                   className={cn(pathname.startsWith(settingsItem.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
                >
                  <settingsItem.icon />
                   <span className="group-data-[collapsible=icon]:hidden">{settingsItem.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <div className="p-2 w-full flex justify-center group-data-[collapsible=icon]:justify-start">
                    <UserButton afterSignOutUrl="/sign-in" />
                 </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <main className="flex-1 flex flex-col h-screen md:ml-[3rem] group-data-[state=expanded]:md:ml-[16rem] transition-[margin-left] duration-300 ease-in-out">
         {children}
      </main>
    </SidebarProvider>
  );

  const mobileLayout = (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <Logo />
          <UserButton afterSignOutUrl="/sign-in" />
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SheetContent side="left" className="p-0 w-72 bg-background/95 backdrop-blur-sm">
        <SheetHeader className="p-4 border-b">
            <SheetTitle><Logo /></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
            <nav className="flex-1 p-4 space-y-2">
                {[...navItems, settingsItem].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all",
                            pathname.startsWith(item.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                        onClick={() => setIsSheetOpen(false)}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      <div className="md:hidden">
        {mobileLayout}
      </div>
      <div className="hidden md:flex">
         {desktopLayout}
      </div>
    </>
  )
}
