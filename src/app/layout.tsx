import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مِرصاد - مرصد العالم العربي',
  description: 'منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
