/**
 * AdSense Configuration
 * إعدادات مركزية لجميع الإعلانات في الموقع
 * 
 * كيفية الاستخدام:
 * 1. سجّل في AdSense وأنشئ الـ slots المطلوبة
 * 2. ضع الـ Slot IDs في متغيرات البيئة (.env)
 * 3. استخدم AD_SLOTS في المكونات
 */

export const AD_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

/**
 * Slot IDs لكل موضع إعلاني في الموقع
 * يمكن تكوينها من متغيرات البيئة لمرونة أكبر
 */
export const AD_SLOTS = {
  // الإعلانات الرئيسية
  homepageBanner: process.env.NEXT_PUBLIC_AD_SLOT_HOMEPAGE_BANNER || '',
  homepageSidebar: process.env.NEXT_PUBLIC_AD_SLOT_HOMEPAGE_SIDEBAR || '',
  
  // صفحة الأخبار
  newsListInFeed: process.env.NEXT_PUBLIC_AD_SLOT_NEWS_INFEED || '',
  newsListLayoutKey: process.env.NEXT_PUBLIC_AD_LAYOUT_KEY_NEWS_INFEED || '-fb+5w+4e-db+86',
  newsTop: process.env.NEXT_PUBLIC_AD_SLOT_NEWS_TOP || '',
  newsBottom: process.env.NEXT_PUBLIC_AD_SLOT_NEWS_BOTTOM || '',
  
  // صفحة المقال
  articleTop: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_TOP || '',
  articleInline: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_INLINE || '',
  articleBottom: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_BOTTOM || '',
  
  // صفحات أخرى
  countryPage: process.env.NEXT_PUBLIC_AD_SLOT_COUNTRY_PAGE || '',
  analyticsPage: process.env.NEXT_PUBLIC_AD_SLOT_ANALYTICS || '',
  
  // إعلانات عامة
  footer: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '',
} as const;

/**
 * إعدادات الإعلانات
 */
export const AD_CONFIG = {
  /** هل الإعلانات مفعّلة في الموقع؟ */
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== 'false',
  
  /** عدد الأخبار قبل ظهور أول إعلان */
  newsItemsBeforeFirstAd: 3,
  
  /** تكرار الإعلانات في القوائم (كل X عنصر) */
  newsAdFrequency: 6,
  
  /** الحد الأقصى للإعلانات في صفحة واحدة */
  maxAdsPerPage: 4,
  
  /** تأخير تحميل الإعلانات (milliseconds) لتحسين الأداء */
  loadDelay: 500,
  
  /** هل نعرض إعلانات في صفحات معينة؟ */
  showOnPages: {
    home: true,
    news: true,
    map: false,        // ❌ الخريطة تحتاج مساحة كاملة
    analytics: true,
    countries: true,
    alerts: false,     // ❌ صفحة وظيفية - بدون إعلانات
    settings: false,   // ❌ صفحة إعدادات - بدون إعلانات
  },
} as const;

/**
 * فحص إذا كان يجب عرض الإعلانات
 */
export function shouldShowAds(): boolean {
  return (
    AD_CONFIG.enabled &&
    !!AD_CLIENT_ID &&
    typeof window !== 'undefined'
  );
}

/**
 * فحص إذا كان slot معيّن مكوّن
 */
export function isSlotConfigured(slot: string): boolean {
  return !!slot && slot.length > 0;
}
