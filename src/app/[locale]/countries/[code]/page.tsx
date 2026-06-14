'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Globe,
  MapPin,
  Users,
  Building2,
  AlertTriangle,
  Shield,
  Newspaper,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Brain,
  ChevronLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Activity,
  BarChart3,
  FileText,
  Zap,
} from 'lucide-react';

// Types
interface CountryDetail {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  capital?: string;
  population?: number;
  region: string;
  regionAr: string;
  riskIndex: number;
  stabilityIndex: number;
  articleCount: number;
  eventCount: number;
  lastUpdate: Date;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trend: 'up' | 'down' | 'stable';
  aiSummary?: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: Date;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'political' | 'economic' | 'security' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Mock data generator
const getMockCountryData = (code: string): CountryDetail | null => {
  const countries: Record<string, CountryDetail> = {
    SA: {
      code: 'SA',
      name: 'Saudi Arabia',
      nameAr: 'السعودية',
      flag: '🇸🇦',
      capital: 'الرياض',
      population: 35950000,
      region: 'gulf',
      regionAr: 'الخليج العربي',
      riskIndex: 25,
      stabilityIndex: 78,
      articleCount: 156,
      eventCount: 23,
      lastUpdate: new Date(),
      riskLevel: 'LOW',
      trend: 'stable',
      aiSummary: 'تتمتع المملكة العربية السعودية باستقرار سياسي واقتصادي مرتفع، مع تركيز متزايد على التنويع الاقتصادي من خلال رؤية 2030. تشير المؤشرات إلى استمرار النمو الاقتصادي مع تحديات محدودة في قطاعات معينة.',
    },
    AE: {
      code: 'AE',
      name: 'United Arab Emirates',
      nameAr: 'الإمارات',
      flag: '🇦🇪',
      capital: 'أبوظبي',
      population: 9890000,
      region: 'gulf',
      regionAr: 'الخليج العربي',
      riskIndex: 20,
      stabilityIndex: 85,
      articleCount: 124,
      eventCount: 15,
      lastUpdate: new Date(),
      riskLevel: 'LOW',
      trend: 'up',
      aiSummary: 'تعد الإمارات من أكثر دول المنطقة استقراراً وازدهاراً اقتصادياً، مع استراتيجية تنويع ناجحة وبيئة استثمارية جاذبة. تتجه الدولة نحو تعزيز مكانتها كمركز عالمي للتكنولوجيا والابتكار.',
    },
    EG: {
      code: 'EG',
      name: 'Egypt',
      nameAr: 'مصر',
      flag: '🇪🇬',
      capital: 'القاهرة',
      population: 104258000,
      region: 'northAfrica',
      regionAr: 'شمال أفريقيا',
      riskIndex: 45,
      stabilityIndex: 62,
      articleCount: 98,
      eventCount: 31,
      lastUpdate: new Date(),
      riskLevel: 'MEDIUM',
      trend: 'down',
      aiSummary: 'تواجه مصر تحديات اقتصادية متعددة مع جهود حكومية للاصلاح المالي. الاستقرار السياسي متوسط مع وجود تحديات اجتماعية واقتصادية.',
    },
    IQ: {
      code: 'IQ',
      name: 'Iraq',
      nameAr: 'العراق',
      flag: '🇮🇶',
      capital: 'بغداد',
      population: 40412000,
      region: 'levant',
      regionAr: 'الشام',
      riskIndex: 72,
      stabilityIndex: 38,
      articleCount: 87,
      eventCount: 45,
      lastUpdate: new Date(),
      riskLevel: 'HIGH',
      trend: 'up',
      aiSummary: 'يظل الوضع في العراق هشاً مع وجود تحديات أمنية وسياسية متعددة. التوترات الطائفية والصراعات على السلطة تؤثر على الاستقرار العام.',
    },
    SY: {
      code: 'SY',
      name: 'Syria',
      nameAr: 'سوريا',
      flag: '🇸🇾',
      capital: 'دمشق',
      population: 17068000,
      region: 'levant',
      regionAr: 'الشام',
      riskIndex: 88,
      stabilityIndex: 15,
      articleCount: 76,
      eventCount: 67,
      lastUpdate: new Date(),
      riskLevel: 'CRITICAL',
      trend: 'up',
    },
    PS: {
      code: 'PS',
      name: 'Palestine',
      nameAr: 'فلسطين',
      flag: '🇵🇸',
      capital: 'القدس',
      population: 5227000,
      region: 'levant',
      regionAr: 'الشام',
      riskIndex: 90,
      stabilityIndex: 8,
      articleCount: 112,
      eventCount: 89,
      lastUpdate: new Date(),
      riskLevel: 'CRITICAL',
      trend: 'up',
      aiSummary: 'تعتبر فلسطين من أكثر المناطق توتراً في العالم بسبب الاحتلال الإسرائيلي المستمر والصراع الفلسطيني الإسرائيلي. الوضع الإنساني والأمني في تدهور مستمر.',
    },
    JO: {
      code: 'JO',
      name: 'Jordan',
      nameAr: 'الأردن',
      flag: '🇯🇴',
      capital: 'عمان',
      population: 10286000,
      region: 'levant',
      regionAr: 'الشام',
      riskIndex: 30,
      stabilityIndex: 72,
      articleCount: 54,
      eventCount: 12,
      lastUpdate: new Date(),
      riskLevel: 'LOW',
      trend: 'stable',
    },
    LB: {
      code: 'LB',
      name: 'Lebanon',
      nameAr: 'لبنان',
      flag: '🇱🇧',
      capital: 'بيروت',
      population: 5592000,
      region: 'levant',
      regionAr: 'الشام',
      riskIndex: 68,
      stabilityIndex: 25,
      articleCount: 62,
      eventCount: 28,
      lastUpdate: new Date(),
      riskLevel: 'HIGH',
      trend: 'up',
      aiSummary: 'يمر لبنان بأزمة اقتصادية وسياسية حادة منذ 2019، مع انهيار العملة الوطنية وتراجع الخدمات الأساسية. الوضع السياسي غير مستقر مع صعوبات في تشكيل الحكومات.',
    },
    YE: {
      code: 'YE',
      name: 'Yemen',
      nameAr: 'اليمن',
      flag: '🇾🇪',
      capital: 'صنعاء',
      population: 30490000,
      region: 'gulf',
      regionAr: 'الخليج العربي',
      riskIndex: 92,
      stabilityIndex: 10,
      articleCount: 89,
      eventCount: 78,
      lastUpdate: new Date(),
      riskLevel: 'CRITICAL',
      trend: 'up',
    },
    KW: {
      code: 'KW',
      name: 'Kuwait',
      nameAr: 'الكويت',
      flag: '🇰🇼',
      capital: 'مدينة الكويت',
      population: 4271000,
      region: 'gulf',
      regionAr: 'الخليج العربي',
      riskIndex: 22,
      stabilityIndex: 80,
      articleCount: 43,
      eventCount: 8,
      lastUpdate: new Date(),
      riskLevel: 'LOW',
      trend: 'stable',
    },
    QA: {
      code: 'QA',
      name: 'Qatar',
      nameAr: 'قطر',
      flag: '🇶🇦',
      capital: 'الدوحة',
      population: 2881000,
      region: 'gulf',
      regionAr: 'الخليج العربي',
      riskIndex: 18,
      stabilityIndex: 88,
      articleCount: 51,
      eventCount: 10,
      lastUpdate: new Date(),
      riskLevel: 'LOW',
      trend: 'up',
    },
  };

  return countries[code] || null;
};

const getMockNews = (countryCode: string): NewsItem[] => {
  const newsTemplates = [
    { title: 'اجتماع طارئ لمجلس الوزراء لمناقشة التطورات', category: 'سياسة' },
    { title: 'ارتفاع في المؤشرات الاقتصادية للربع الأول', category: 'اقتصاد' },
    { title: 'مبادرة جديدة لتعزيز التعاون الإقليمي', category: 'سياسة' },
    { title: 'توقعات بنمو القطاع الخاص بنسبة 5%', category: 'اقتصاد' },
    { title: 'زيارة رسمية لوفد حكومي رفيع المستوى', category: 'سياسة' },
    { title: 'افتتاح مشروعات تنموية جديدة', category: 'تنمية' },
    { title: 'تصريحات رسمية بشأن القضايا الإقليمية', category: 'سياسة' },
    { title: 'تحسن في معدلات الاستثمار الأجنبي', category: 'اقتصاد' },
  ];

  return newsTemplates.slice(0, 6).map((template, index) => ({
    id: `${countryCode}-${index}`,
    title: template.title,
    summary: 'ملخص تفصيلي للخبر يوضح النقاط الرئيسية والمستجدات المتعلقة بالموضوع.',
    source: ['الجزيرة', 'العربية', 'الخليج', 'البيان', 'الأهرام'][index % 5],
    category: template.category,
    publishedAt: new Date(Date.now() - index * 60 * 60 * 1000),
    riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][index % 4] as NewsItem['riskLevel'],
  }));
};

const getMockTimeline = (countryCode: string): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      id: '1',
      title: 'اجتماع قمة إقليمية',
      description: 'انعقاد قمة إقليمية لمناقشة التطورات السياسية والاقتصادية.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'political',
      severity: 'high',
    },
    {
      id: '2',
      title: 'إعلان حزمة إصلاحات اقتصادية',
      description: 'إعلان الحكومة عن حزمة إصلاحات اقتصادية شاملة.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'economic',
      severity: 'medium',
    },
    {
      id: '3',
      title: 'تحديث أمني هام',
      description: 'إعلان رسمي عن تطورات أمنية في المنطقة.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: 'security',
      severity: 'critical',
    },
    {
      id: '4',
      title: 'زيارة دبلوماسية رفيعة المستوى',
      description: 'استقبال وفد دبلوماسي رفيع المستوى.',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      type: 'political',
      severity: 'low',
    },
    {
      id: '5',
      title: 'افتتاح مشروعات تنموية',
      description: 'افتتاح مجموعة من المشروعات التنموية الجديدة.',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      type: 'social',
      severity: 'medium',
    },
  ];

  return events;
};

// Risk level styling
const riskColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const riskLabels: Record<string, string> = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};

const riskProgressColors: Record<string, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const eventTypeIcons: Record<string, React.ReactNode> = {
  political: <Globe className="h-4 w-4" />,
  economic: <BarChart3 className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
};

const eventTypeColors: Record<string, string> = {
  political: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  economic: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  security: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  social: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

const severityColors: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

// Loading skeleton component
function CountryDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function CountryNotFound({ locale }: { locale: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Globe className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">الدولة غير موجودة</h2>
          <p className="text-muted-foreground mb-6">لم يتم العثور على الدولة المطلوبة</p>
          <Link href={`/${locale}/countries`}>
            <Button>
              <ChevronLeft className="h-4 w-4 ms-2" />
              العودة للدول
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CountryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = React.use(params);
  const [isLoading, setIsLoading] = React.useState(true);
  const [country, setCountry] = React.useState<CountryDetail | null>(null);
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [timeline, setTimeline] = React.useState<TimelineEvent[]>([]);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const countryData = getMockCountryData(code.toUpperCase());
      setCountry(countryData);
      if (countryData) {
        setNews(getMockNews(code));
        setTimeline(getMockTimeline(code));
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [code]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-green-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  // Loading state
  if (isLoading) {
    return <CountryDetailSkeleton />;
  }

  // Not found state
  if (!country) {
    return <CountryNotFound locale={locale} />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${locale}`}>الرئيسية</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${locale}/countries`}>الدول</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{country.nameAr}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Country Header Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Risk indicator bar */}
          <div className={cn(
            'h-2 w-full',
            country.riskLevel === 'LOW' && 'bg-green-500',
            country.riskLevel === 'MEDIUM' && 'bg-yellow-500',
            country.riskLevel === 'HIGH' && 'bg-orange-500',
            country.riskLevel === 'CRITICAL' && 'bg-red-500',
          )} />

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Flag */}
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-7xl md:text-8xl">{country.flag}</span>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">{country.nameAr}</h1>
                      <p className="text-muted-foreground">{country.name}</p>
                    </div>
                    {getTrendIcon(country.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={riskColors[country.riskLevel]}>
                      مخاطر {riskLabels[country.riskLevel]}
                    </Badge>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {country.capital && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">العاصمة</p>
                        <p className="font-semibold">{country.capital}</p>
                      </div>
                    </div>
                  )}
                  {country.population && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">السكان</p>
                        <p className="font-semibold">{formatNumber(country.population)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Newspaper className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">المقالات</p>
                      <p className="font-semibold">{formatNumber(country.articleCount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">الأحداث</p>
                      <p className="font-semibold">{formatNumber(country.eventCount)}</p>
                    </div>
                  </div>
                </div>

                {/* Region */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{country.regionAr}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk & Stability Indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Risk Index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              مؤشر المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{country.riskIndex}%</span>
                <Badge className={riskColors[country.riskLevel]}>
                  {riskLabels[country.riskLevel]}
                </Badge>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', riskProgressColors[country.riskLevel])}
                  style={{ width: `${country.riskIndex}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>منخفض</span>
                <span>حرج</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stability Index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              مؤشر الاستقرار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{country.stabilityIndex}%</span>
                <Badge variant="outline">
                  {country.stabilityIndex >= 70 ? 'مستقر' : country.stabilityIndex >= 40 ? 'متوسط' : 'غير مستقر'}
                </Badge>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${country.stabilityIndex}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>غير مستقر</span>
                <span>مستقر</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Card */}
      {country.aiSummary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              ملخص ذكي
            </CardTitle>
            <CardDescription>تحليل بالذكاء الاصطناعي للوضع في {country.nameAr}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{country.aiSummary}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>آخر تحديث: {formatTimeAgo(country.lastUpdate)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            آخر الأخبار
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Activity className="h-4 w-4" />
            الجدول الزمني
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        {/* News Tab */}
        <TabsContent value="news">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>آخر الأخبار من {country.nameAr}</CardTitle>
              <Link href={`/${locale}/news?country=${country.code}`}>
                <Button variant="ghost" size="sm">
                  عرض الكل
                  <ChevronLeft className="ms-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pe-4">
                <div className="space-y-4">
                  {news.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={cn('text-xs', riskColors[item.riskLevel])}
                              >
                                {riskLabels[item.riskLevel]}
                              </Badge>
                            </div>
                            <h3 className="font-medium leading-tight group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(item.publishedAt)}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>الجدول الزمني للأحداث</CardTitle>
              <CardDescription>آخر الأحداث المهمة في {country.nameAr}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pe-4">
                <div className="relative pe-4">
                  {/* Timeline line */}
                  <div className="absolute end-4 top-0 bottom-0 w-0.5 bg-muted" />

                  <div className="space-y-6">
                    {timeline.map((event, index) => (
                      <div key={event.id} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className={cn(
                          'absolute end-2.5 w-3 h-3 rounded-full ring-4 ring-background',
                          severityColors[event.severity]
                        )} />

                        <div className="me-8 flex-1">
                          <Card className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={cn('text-xs', eventTypeColors[event.type])}>
                                      <span className="flex items-center gap-1">
                                        {eventTypeIcons[event.type]}
                                        {event.type === 'political' && 'سياسي'}
                                        {event.type === 'economic' && 'اقتصادي'}
                                        {event.type === 'security' && 'أمني'}
                                        {event.type === 'social' && 'اجتماعي'}
                                      </span>
                                    </Badge>
                                    <div className={cn(
                                      'w-2 h-2 rounded-full',
                                      severityColors[event.severity]
                                    )} />
                                  </div>
                                  <h4 className="font-medium mb-1">{event.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {event.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(event.date)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  إجمالي المقالات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(country.articleCount)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  مقال تم نشره عن {country.nameAr}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>هذا الأسبوع</span>
                    <span>+{Math.floor(country.articleCount * 0.15)}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" />
                  الأحداث المسجلة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(country.eventCount)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  حدث مهم تم توثيقه
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>هذا الشهر</span>
                    <span>+{Math.floor(country.eventCount * 0.2)}</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  آخر تحديث
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatTimeAgo(country.lastUpdate)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(country.lastUpdate)}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">مراقبة مستمرة</span>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" />
                  توزيع المخاطر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.floor(country.articleCount * 0.4)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">منخفض</div>
                    <div className="h-1 bg-green-500 rounded mt-2" />
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.floor(country.articleCount * 0.3)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">متوسط</div>
                    <div className="h-1 bg-yellow-500 rounded mt-2" />
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.floor(country.articleCount * 0.2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">عالي</div>
                    <div className="h-1 bg-orange-500 rounded mt-2" />
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {Math.floor(country.articleCount * 0.1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">حرج</div>
                    <div className="h-1 bg-red-500 rounded mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
