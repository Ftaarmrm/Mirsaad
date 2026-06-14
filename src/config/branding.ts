/**
 * مِرصاد - Arab Monitor
 * نظام العلامة التجارية المتعدد النسخ
 * Multi-Variant Branding System
 */

export interface BrandConfig {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  logo?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: {
    map: boolean;
    ai: boolean;
    alerts: boolean;
    analytics: boolean;
    timeline: boolean;
    export: boolean;
  };
  defaultSectors: Sector[];
  defaultCountries: string[];
  defaultSources: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Sector {
  id: string;
  name: string;
  nameAr: string;
  icon?: string;
  description?: string;
  descriptionAr?: string;
}

/**
 * النسخ المتاحة من المنصة
 */
export const BRAND_VARIANTS: Record<string, BrandConfig> = {
  default: {
    id: 'default',
    name: 'Arab Monitor',
    nameAr: 'مِرصاد',
    tagline: 'Your Window to the Arab World',
    taglineAr: 'نافذتك على العالم العربي',
    description: 'A comprehensive platform for monitoring and analyzing news and events across the Arab world.',
    descriptionAr: 'منصة شاملة لرصد وتحليل الأخبار والأحداث في العالم العربي.',
    theme: {
      primary: 'hsl(142, 76%, 36%)',   // أخضر
      secondary: 'hsl(38, 92%, 50%)',  // ذهبي
      accent: 'hsl(221, 83%, 53%)',    // أزرق
    },
    features: {
      map: true,
      ai: true,
      alerts: true,
      analytics: true,
      timeline: true,
      export: true,
    },
    defaultSectors: [
      { id: 'geopolitics', name: 'Geopolitics', nameAr: 'الجيوسياسة', icon: 'Globe' },
      { id: 'economy', name: 'Economy', nameAr: 'الاقتصاد', icon: 'TrendingUp' },
      { id: 'security', name: 'Security', nameAr: 'الأمن', icon: 'Shield' },
      { id: 'energy', name: 'Energy', nameAr: 'الطاقة', icon: 'Zap' },
      { id: 'technology', name: 'Technology', nameAr: 'التقنية', icon: 'Cpu' },
    ],
    defaultCountries: ['SA', 'AE', 'EG', 'IQ', 'SY', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM', 'YE', 'LY', 'TN', 'DZ', 'MA', 'SD', 'PS'],
    defaultSources: [],
    social: {
      twitter: 'https://twitter.com/arabmonitor',
      github: 'https://github.com/mirsad',
    },
  },

  economy: {
    id: 'economy',
    name: 'Arab Economy Monitor',
    nameAr: 'مرصد الاقتصاد العربي',
    tagline: 'Tracking Arab Economies',
    taglineAr: 'تتبع الاقتصادات العربية',
    description: 'Specialized platform for monitoring economic news and indicators in the Arab world.',
    descriptionAr: 'منصة متخصصة في رصد الأخبار والمؤشرات الاقتصادية في العالم العربي.',
    theme: {
      primary: 'hsl(38, 92%, 50%)',    // ذهبي
      secondary: 'hsl(142, 76%, 36%)', // أخضر
      accent: 'hsl(221, 83%, 53%)',    // أزرق
    },
    features: {
      map: true,
      ai: true,
      alerts: true,
      analytics: true,
      timeline: true,
      export: true,
    },
    defaultSectors: [
      { id: 'markets', name: 'Markets', nameAr: 'الأسواق', icon: 'TrendingUp' },
      { id: 'banking', name: 'Banking', nameAr: 'البنوك', icon: 'Landmark' },
      { id: 'trade', name: 'Trade', nameAr: 'التجارة', icon: 'Ship' },
      { id: 'investment', name: 'Investment', nameAr: 'الاستثمار', icon: 'PiggyBank' },
      { id: 'energy', name: 'Energy', nameAr: 'الطاقة', icon: 'Zap' },
    ],
    defaultCountries: ['SA', 'AE', 'EG', 'QA', 'KW', 'BH', 'OM'],
    defaultSources: [],
  },

  tech: {
    id: 'tech',
    name: 'Arab Tech Monitor',
    nameAr: 'مرصد التقنية العربية',
    tagline: 'Arab Tech Ecosystem',
    taglineAr: 'منظومة التقنية العربية',
    description: 'Platform for monitoring technology news and startups in the Arab world.',
    descriptionAr: 'منصة لرصد أخبار التقنية والشركات الناشئة في العالم العربي.',
    theme: {
      primary: 'hsl(262, 83%, 58%)',   // بنفسجي
      secondary: 'hsl(199, 89%, 48%)', // سماوي
      accent: 'hsl(142, 76%, 36%)',    // أخضر
    },
    features: {
      map: true,
      ai: true,
      alerts: true,
      analytics: true,
      timeline: true,
      export: true,
    },
    defaultSectors: [
      { id: 'startups', name: 'Startups', nameAr: 'الشركات الناشئة', icon: 'Rocket' },
      { id: 'ai', name: 'AI & ML', nameAr: 'الذكاء الاصطناعي', icon: 'Brain' },
      { id: 'fintech', name: 'Fintech', nameAr: 'التقنية المالية', icon: 'Wallet' },
      { id: 'ecommerce', name: 'E-Commerce', nameAr: 'التجارة الإلكترونية', icon: 'ShoppingCart' },
      { id: 'cybersecurity', name: 'Cybersecurity', nameAr: 'الأمن السيبراني', icon: 'Shield' },
    ],
    defaultCountries: ['AE', 'SA', 'EG', 'JO', 'LB'],
    defaultSources: [],
  },

  energy: {
    id: 'energy',
    name: 'Arab Energy Monitor',
    nameAr: 'مرصد الطاقة العربية',
    tagline: 'Powering the Region',
    taglineAr: 'طاقة المنطقة',
    description: 'Specialized platform for monitoring energy sector news in the Arab world.',
    descriptionAr: 'منصة متخصصة في رصد أخبار قطاع الطاقة في العالم العربي.',
    theme: {
      primary: 'hsl(38, 92%, 50%)',    // ذهبي (نفط)
      secondary: 'hsl(142, 76%, 36%)', // أخضر (متصلد)
      accent: 'hsl(199, 89%, 48%)',    // أزرق (غاز)
    },
    features: {
      map: true,
      ai: true,
      alerts: true,
      analytics: true,
      timeline: true,
      export: true,
    },
    defaultSectors: [
      { id: 'oil', name: 'Oil & Gas', nameAr: 'النفط والغاز', icon: 'Droplet' },
      { id: 'renewable', name: 'Renewable Energy', nameAr: 'الطاقة المتجددة', icon: 'Sun' },
      { id: 'nuclear', name: 'Nuclear', nameAr: 'النووي', icon: 'Atom' },
      { id: 'hydrogen', name: 'Hydrogen', nameAr: 'الهيدروجين', icon: 'Flame' },
      { id: 'infrastructure', name: 'Infrastructure', nameAr: 'البنية التحتية', icon: 'Building' },
    ],
    defaultCountries: ['SA', 'AE', 'IQ', 'KW', 'QA', 'LY', 'DZ'],
    defaultSources: [],
  },
};

/**
 * الحصول على تكوين العلامة التجارية الحالي
 */
export function getBrandConfig(variantId?: string): BrandConfig {
  const variant = variantId || process.env.NEXT_PUBLIC_BRAND_VARIANT || 'default';
  return BRAND_VARIANTS[variant] || BRAND_VARIANTS.default;
}

/**
 * قائمة جميع النسخ المتاحة
 */
export function getAvailableVariants(): BrandConfig[] {
  return Object.values(BRAND_VARIANTS);
}
