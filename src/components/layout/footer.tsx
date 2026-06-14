'use client';

import Link from 'next/link';
import { Shield, Github, Globe } from 'lucide-react';

export function Footer({ locale = 'ar' }: { locale?: string }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">مِرصاد</h3>
            <p className="text-sm text-muted-foreground">
              منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/news`} className="hover:text-foreground transition-colors">الأخبار</Link></li>
              <li><Link href={`/${locale}/map`} className="hover:text-foreground transition-colors">الخريطة</Link></li>
              <li><Link href={`/${locale}/analytics`} className="hover:text-foreground transition-colors">التحليلات</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-foreground transition-colors">عن المنصة</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">الموارد</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/countries`} className="hover:text-foreground transition-colors">الدول</Link></li>
              <li><Link href={`/${locale}/alerts`} className="hover:text-foreground transition-colors">التنبيهات</Link></li>
              <li><Link href={`/${locale}/signals`} className="hover:text-foreground transition-colors">الإشارات</Link></li>
              <li><Link href={`/${locale}/settings`} className="hover:text-foreground transition-colors">الإعدادات</Link></li>
            </ul>
          </div>
          
          {/* Contact / Admin */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">إدارة المنصة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span dir="ltr">mirsad.app</span>
              </li>
              <li>
                <Link 
                  href="/admin/ads" 
                  className="hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                  <Shield className="h-3 w-3 group-hover:text-primary" />
                  <span>لوحة تحكم الأدمن</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} مِرصاد. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              سياسة الخصوصية
            </Link>
            <span>•</span>
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
