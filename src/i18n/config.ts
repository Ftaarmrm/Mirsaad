export type Locale = 'ar' | 'en';

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

export const isRtl = (locale: Locale): boolean => locale === 'ar';

export const getDirection = (locale: Locale): 'rtl' | 'ltr' => locale === 'ar' ? 'rtl' : 'ltr';
