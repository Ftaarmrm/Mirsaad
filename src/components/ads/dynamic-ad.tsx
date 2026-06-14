'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotData {
  id: string;
  name: string;
  slotId: string;
  clientId?: string;
  position: string;
  format: string;
  width?: number;
  height?: number;
  responsive: boolean;
  layout?: string;
  layoutKey?: string;
  showLabel: boolean;
  labelText: string;
  isActive: boolean;
  priority: number;
}

/**
 * مكون إعلان ديناميكي
 * يجلب إعدادات الإعلان تلقائياً من قاعدة البيانات حسب الموضع
 * 
 * الاستخدام:
 * <DynamicAd position="HOME_TOP" />
 * <DynamicAd position="NEWS_INFEED" />
 */
export function DynamicAd({ 
  position, 
  className,
  fallback = null,
}: { 
  position: string; 
  className?: string;
  fallback?: React.ReactNode;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['ads', position],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ads?position=${position}&activeOnly=true`);
      if (!res.ok) throw new Error('Failed to fetch ad');
      const json = await res.json();
      return json.data as AdSlotData[];
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) return null;
  if (!data || data.length === 0) return <>{fallback}</>;

  // اختر الإعلان ذو الأولوية الأعلى
  const ad = data[0];

  return <AdRenderer ad={ad} className={className} />;
}

/**
 * المكون الذي يعرض الإعلان فعلياً
 */
function AdRenderer({ ad, className }: { ad: AdSlotData; className?: string }) {
  const envClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const clientId = ad.clientId || envClientId;
  const isProduction = process.env.NODE_ENV === 'production';

  React.useEffect(() => {
    if (!clientId || !isProduction) return;
    
    try {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 100);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('[DynamicAd] Failed to push ad:', err);
    }
  }, [clientId, isProduction, ad.id]);

  // في بيئة التطوير: عرض placeholder
  if (!isProduction || !clientId) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center my-4',
          className
        )}
        style={{
          minHeight: ad.height ? `${ad.height}px` : '120px',
          width: ad.width ? `${ad.width}px` : '100%',
          maxWidth: '100%',
        }}
      >
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {ad.labelText} • {ad.name}
        </span>
        <span className="mt-1 text-[10px] text-muted-foreground/70">
          Slot: {ad.slotId} • {ad.position} • {ad.format}
          {ad.width && ad.height && ` • ${ad.width}×${ad.height}`}
        </span>
        <span className="mt-1 text-[10px] text-muted-foreground/50">
          AdSense Placeholder — لن يظهر في الإنتاج
        </span>
      </div>
    );
  }

  // formatMap من قاعدة البيانات إلى AdSense
  const formatMap: Record<string, string> = {
    AUTO: 'auto',
    RECTANGLE: 'rectangle',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
    SQUARE: 'rectangle',
    FLUID: 'fluid',
  };

  const adStyle: React.CSSProperties = { display: 'block' };
  if (ad.width) adStyle.width = `${ad.width}px`;
  if (ad.height) adStyle.height = `${ad.height}px`;

  return (
    <div className={cn('ad-container my-4', className)}>
      {ad.showLabel && ad.labelText && (
        <div className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {ad.labelText}
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={clientId}
        data-ad-slot={ad.slotId}
        data-ad-format={formatMap[ad.format] || 'auto'}
        data-ad-layout={ad.layout || undefined}
        data-ad-layout-key={ad.layoutKey || undefined}
        data-full-width-responsive={ad.responsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * عرض جميع الإعلانات لموضع معين (إذا كان هناك أكثر من واحد)
 */
export function DynamicAdsAll({ position, className }: { position: string; className?: string }) {
  const { data } = useQuery({
    queryKey: ['ads', position],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ads?position=${position}&activeOnly=true`);
      const json = await res.json();
      return json.data as AdSlotData[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map(ad => (
        <AdRenderer key={ad.id} ad={ad} className={className} />
      ))}
    </>
  );
}
