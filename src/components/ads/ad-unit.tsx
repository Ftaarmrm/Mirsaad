'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  /** Ad Slot ID من AdSense */
  slot: string;
  /** تنسيق الإعلان */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  /** layout للإعلانات Fluid (in-feed/in-article) */
  layout?: string;
  /** Layout Key للإعلانات المخصصة */
  layoutKey?: string;
  /** هل الإعلان متجاوب؟ */
  responsive?: boolean;
  /** ستايل إضافي */
  className?: string;
  /** ستايل inline */
  style?: React.CSSProperties;
  /** نص يظهر فوق الإعلان (للشفافية) */
  label?: string;
}

/**
 * وحدة إعلانية AdSense قابلة لإعادة الاستخدام
 * 
 * مثال:
 * <AdUnit slot="1234567890" format="auto" responsive />
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  className,
  style,
  label = 'إعلان',
}: AdUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = React.useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // لا تُحمّل في development أو إذا لم يكن AdSense مُكوّن
    if (!clientId || process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!slot) {
      console.warn('[AdUnit] No slot ID provided');
      return;
    }

    try {
      // انتظر تحميل سكربت AdSense
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('[AdUnit] Error loading ad:', err);
      setHasError(true);
    }
  }, [clientId, slot]);

  // في بيئة التطوير: عرض placeholder
  if (process.env.NODE_ENV !== 'production' || !clientId) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center',
          className
        )}
        style={style}
      >
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label} (Slot: {slot})
        </span>
        <span className="mt-1 text-[10px] text-muted-foreground/70">
          AdSense Placeholder — لن يظهر في الإنتاج
        </span>
      </div>
    );
  }

  // إذا فشل التحميل، لا تُظهر أي شيء
  if (hasError) return null;

  return (
    <div className={cn('ad-container', className)} style={style}>
      {label && (
        <div className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <ins
        ref={adRef as React.RefObject<HTMLModElement>}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * إعلان داخل المقالة
 * مناسب لوضعه بين فقرات المحتوى
 */
export function InArticleAd({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      layout="in-article"
      className={cn('my-6', className)}
      label="محتوى ممول"
    />
  );
}

/**
 * إعلان داخل قائمة (in-feed)
 * مناسب لقوائم الأخبار والمقالات
 */
export function InFeedAd({ 
  slot, 
  layoutKey, 
  className 
}: { 
  slot: string; 
  layoutKey: string;
  className?: string;
}) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      layout="in-feed"
      layoutKey={layoutKey}
      className={cn('my-4', className)}
      label="إعلان ممول"
    />
  );
}

/**
 * إعلان للشريط الجانبي
 * عمودي - مناسب للـ sidebar
 */
export function SidebarAd({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="vertical"
      className={cn('w-full min-h-[600px]', className)}
      label="إعلان"
      style={{ minHeight: '250px' }}
    />
  );
}

/**
 * إعلان مستطيل (Banner)
 * مناسب للأعلى والأسفل
 */
export function BannerAd({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="horizontal"
      className={cn('w-full', className)}
      label="إعلان"
      style={{ minHeight: '90px' }}
    />
  );
}

/**
 * إعلان متجاوب (Responsive)
 * يتكيف تلقائياً مع الحجم المتاح
 */
export function ResponsiveAd({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="auto"
      responsive
      className={cn('w-full', className)}
      label="إعلان"
    />
  );
}
