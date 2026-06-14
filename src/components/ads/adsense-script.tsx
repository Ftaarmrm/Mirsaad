import Script from 'next/script';

/**
 * AdSense Script Component
 * يُحمّل سكربت AdSense الأساسي مرة واحدة في كامل التطبيق
 * يجب وضعه في الـ layout الجذري
 */
export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  // لا تُحمّل السكربت إذا لم يتم تكوينه أو في بيئة التطوير
  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AdSense] NEXT_PUBLIC_ADSENSE_CLIENT_ID is not set. Ads will not load.');
    }
    return null;
  }
  
  return (
    <Script
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      onError={(e) => {
        console.error('[AdSense] Script failed to load:', e);
      }}
    />
  );
}

/**
 * Meta tag للتحقق من ملكية AdSense
 * يستخدم في layout للتحقق من الموقع
 */
export function AdSenseMeta() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;
  
  return <meta name="google-adsense-account" content={clientId} />;
}
