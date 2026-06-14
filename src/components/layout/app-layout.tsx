'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export function AppLayout({ children, locale }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const pathname = usePathname();

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const isRtl = locale === 'ar';

  return (
    <div 
      className={cn(
        "min-h-screen bg-background font-arabic",
        isRtl && "rtl"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        locale={locale}
      />

      {/* Main content area */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:ps-16" : "lg:ps-64",
          !sidebarOpen && "lg:ps-0"
        )}
      >
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          locale={locale}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/50 px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} مِرصاد. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                شروط الاستخدام
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                API
              </a>
              <span className="text-muted-foreground/30">•</span>
              <a 
                href="/admin/ads" 
                className="hover:text-foreground transition-colors inline-flex items-center gap-1 opacity-60 hover:opacity-100"
                title="لوحة تحكم الأدمن"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>إدارة</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
