import type { Locale } from './config';
import { getRequestConfig } from 'next-intl/server';

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const validLocale = locale && locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./${validLocale}.json`)).default,
    timeZone: 'Asia/Riyadh',
    now: new Date(),
  };
});

export type Messages = typeof import('./ar.json');
