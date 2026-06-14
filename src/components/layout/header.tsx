'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Monitor,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  Radio,
  Languages,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  locale: string;
}

export function Header({ onMenuClick, locale }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isRtl = locale === 'ar';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>

        {/* Logo for mobile */}
        <Link href={`/${locale}`} className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radio className="h-5 w-5" />
          </div>
          <span className="font-bold">مِرصاد</span>
        </Link>

        {/* Search bar - Desktop */}
        <div className="relative hidden md:block">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isRtl ? 'بحث...' : 'Search...'}
            className={cn(
              'w-64 bg-background ps-9',
              searchOpen && 'w-80'
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="absolute end-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs opacity-100 sm:flex">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
              <span className="sr-only">
                {isRtl ? 'تغيير اللغة' : 'Change language'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? 'start' : 'end'}>
            <DropdownMenuLabel>
              {isRtl ? 'اللغة' : 'Language'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${locale}`} className={cn(locale === 'ar' && 'bg-accent')}>
                العربية
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${otherLocale}`} className={cn(locale === 'en' && 'bg-accent')}>
                English
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme switcher */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isRtl ? 'تغيير السمة' : 'Toggle theme'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? 'start' : 'end'}>
              <DropdownMenuLabel>
                {isRtl ? 'المظهر' : 'Theme'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 me-2" />
                {isRtl ? 'فاتح' : 'Light'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 me-2" />
                {isRtl ? 'داكن' : 'Dark'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-4 w-4 me-2" />
                {isRtl ? 'النظام' : 'System'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                className="absolute -top-1 -end-1 h-5 w-5 rounded-full p-0 text-xs"
                variant="destructive"
              >
                3
              </Badge>
              <span className="sr-only">
                {isRtl ? 'الإشعارات' : 'Notifications'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? 'start' : 'end'} className="w-80">
            <DropdownMenuLabel>
              {isRtl ? 'الإشعارات' : 'Notifications'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">
                  {isRtl ? 'تنبيه جديد' : 'New Alert'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isRtl
                    ? 'تم اكتشاف تصاعد في المنطقة'
                    : 'Escalation detected in the region'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isRtl ? 'منذ 5 دقائق' : '5 minutes ago'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">
                  {isRtl ? 'حدث مهم' : 'Important Event'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isRtl
                    ? 'اجتماع قمة في الرياض'
                    : 'Summit meeting in Riyadh'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isRtl ? 'منذ ساعة' : '1 hour ago'}
                </span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              {isRtl ? 'عرض جميع الإشعارات' : 'View all notifications'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">
                {isRtl ? 'قائمة المستخدم' : 'User menu'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? 'start' : 'end'} className="w-56">
            <DropdownMenuLabel>
              {isRtl ? 'حسابي' : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 me-2" />
              {isRtl ? 'الملف الشخصي' : 'Profile'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 me-2" />
              {isRtl ? 'الإعدادات' : 'Settings'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="h-4 w-4 me-2" />
              {isRtl ? 'تسجيل الخروج' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
