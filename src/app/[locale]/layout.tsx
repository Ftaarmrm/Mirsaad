import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { locales, type Locale } from '@/i18n/config';
import { AppLayout } from '@/components/layout/app-layout';
import { QueryProvider } from '@/components/providers/query-provider';
import { AdSenseScript, AdSenseMeta } from '@/components/ads/adsense-script';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'مِرصاد - مرصد العالم العربي',
    template: '%s | مِرصاد',
  },
  description: 'منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي',
  keywords: ['أخبار', 'العالم العربي', 'تحليل', 'رصد', 'ذكاء اصطناعي', 'مِرصاد'],
  authors: [{ name: 'Mirsad Team' }],
  creator: 'Mirsad',
  publisher: 'Mirsad',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'مِرصاد',
    title: 'مِرصاد - مرصد العالم العربي',
    description: 'منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مِرصاد - مرصد العالم العربي',
    description: 'منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <AdSenseMeta />
      </head>
      <body className="font-arabic">
        <AdSenseScript />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <AppLayout locale={locale}>
                {children}
              </AppLayout>
              <Toaster position="top-center" />
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
