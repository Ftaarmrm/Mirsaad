'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Map,
  Newspaper,
  Globe,
  Brain,
  Bell,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Radio,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
  locale: string;
}

const mainNavItems = [
  {
    id: 'dashboard',
    labelAr: 'لوحة التحكم',
    labelEn: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'map',
    labelAr: 'الخريطة',
    labelEn: 'Map',
    icon: Map,
    href: '/map',
  },
  {
    id: 'news',
    labelAr: 'الأخبار',
    labelEn: 'News',
    icon: Newspaper,
    href: '/news',
  },
  {
    id: 'countries',
    labelAr: 'الدول',
    labelEn: 'Countries',
    icon: Globe,
    href: '/countries',
  },
];

const analysisNavItems = [
  {
    id: 'analytics',
    labelAr: 'التحليلات',
    labelEn: 'Analytics',
    icon: Brain,
    href: '/analytics',
  },
  {
    id: 'alerts',
    labelAr: 'التنبيهات',
    labelEn: 'Alerts',
    icon: Bell,
    href: '/alerts',
  },
  {
    id: 'signals',
    labelAr: 'الإشارات',
    labelEn: 'Signals',
    icon: Zap,
    href: '/signals',
  },
];

const bottomNavItems = [
  {
    id: 'settings',
    labelAr: 'الإعدادات',
    labelEn: 'Settings',
    icon: Settings,
    href: '/settings',
  },
  {
    id: 'about',
    labelAr: 'عن المنصة',
    labelEn: 'About',
    icon: Info,
    href: '/about',
  },
];

// NavSection component defined outside of the main component
function NavSection({
  title,
  items,
  collapsed,
  locale,
  pathname,
}: {
  title: string;
  items: typeof mainNavItems;
  collapsed: boolean;
  locale: string;
  pathname: string;
}) {
  const isRtl = locale === 'ar';

  return (
    <div className="space-y-1">
      {!collapsed && title && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </h3>
      )}
      {items.map((item) => {
        const isActive = pathname === `/${locale}${item.href}` || 
                         (item.href !== '/' && pathname.startsWith(`/${locale}${item.href}`));
        const label = isRtl ? item.labelAr : item.labelEn;
        const Icon = item.icon;

        const linkContent = (
          <Link
            href={`/${locale}${item.href}`}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side={isRtl ? 'left' : 'right'} className="font-arabic">
                {label}
              </TooltipContent>
            </Tooltip>
          );
        }

        return <React.Fragment key={item.id}>{linkContent}</React.Fragment>;
      })}
    </div>
  );
}

export function Sidebar({
  isOpen,
  isCollapsed,
  onToggle,
  onCollapse,
  locale,
}: SidebarProps) {
  const pathname = usePathname();
  const isRtl = locale === 'ar';

  return (
    <TooltipProvider>
      <>
        {/* Mobile sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 z-50 flex w-64 flex-col border-e bg-card transition-transform duration-300 lg:hidden',
            isRtl ? 'right-0' : 'left-0',
            isOpen
              ? 'translate-x-0'
              : isRtl
                ? 'translate-x-full'
                : '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radio className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">مِرصاد</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <NavSection
              title="الرئيسية"
              items={mainNavItems}
              collapsed={false}
              locale={locale}
              pathname={pathname}
            />
            <Separator className="my-4" />
            <NavSection
              title="التحليلات"
              items={analysisNavItems}
              collapsed={false}
              locale={locale}
              pathname={pathname}
            />
          </ScrollArea>
          <div className="border-t p-3">
            <NavSection
              title=""
              items={bottomNavItems}
              collapsed={false}
              locale={locale}
              pathname={pathname}
            />
          </div>
        </aside>

        {/* Desktop sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 z-40 hidden flex-col border-e bg-card transition-all duration-300 lg:flex',
            isRtl ? 'right-0' : 'left-0',
            isCollapsed ? 'w-16' : 'w-64',
            !isOpen && 'hidden'
          )}
        >
          <div
            className={cn(
              'flex h-16 items-center border-b',
              isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
            )}
          >
            {(!isCollapsed || !isOpen) && (
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Radio className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-lg font-bold">مِرصاد</span>
                )}
              </Link>
            )}
            {isCollapsed && isOpen && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radio className="h-5 w-5" />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <NavSection
              title={isCollapsed ? '' : 'الرئيسية'}
              items={mainNavItems}
              collapsed={isCollapsed}
              locale={locale}
              pathname={pathname}
            />
            <Separator className="my-4" />
            <NavSection
              title={isCollapsed ? '' : 'التحليلات'}
              items={analysisNavItems}
              collapsed={isCollapsed}
              locale={locale}
              pathname={pathname}
            />
          </ScrollArea>

          <div className="border-t p-3">
            <NavSection
              title=""
              items={bottomNavItems}
              collapsed={isCollapsed}
              locale={locale}
              pathname={pathname}
            />
          </div>

          {/* Collapse button */}
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className={cn('w-full', isCollapsed && 'justify-center')}
            >
              {isCollapsed ? (
                isRtl ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : isRtl ? (
                <>
                  <ChevronRight className="h-4 w-4 ms-2" />
                  <span>تصغير</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 me-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>
      </>
    </TooltipProvider>
  );
}
