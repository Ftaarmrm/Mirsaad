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
import {
  Newspaper,
  Globe,
  AlertTriangle,
  TrendingUp,
  Activity,
  Brain,
  Map,
  ArrowLeft,
  Clock,
  Flame,
  Shield,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { useStats, useNews, useCountries, useAlerts, useFetchNews } from '@/hooks/use-api';
import { toast } from 'sonner';
import { DynamicAd } from '@/components/ads/dynamic-ad';

const riskColors: Record<string, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const riskLabels: Record<string, string> = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};

const categoryLabels: Record<string, string> = {
  POLITICS: 'سياسة',
  ECONOMY: 'اقتصاد',
  SECURITY: 'أمن',
  TECHNOLOGY: 'تقنية',
  ENERGY: 'طاقة',
  HEALTH: 'صحة',
  ENVIRONMENT: 'بيئة',
  SPORTS: 'رياضة',
  CULTURE: 'ثقافة',
  OTHER: 'أخرى',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  return `منذ ${diffDays} يوم`;
}

function getCountryRiskLevel(riskIndex: number | undefined): string {
  if (!riskIndex) return 'LOW';
  if (riskIndex >= 7) return 'CRITICAL';
  if (riskIndex >= 5) return 'HIGH';
  if (riskIndex >= 3) return 'MEDIUM';
  return 'LOW';
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);

  // جلب البيانات الحقيقية من API
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useStats('24h');
  const { data: newsData, isLoading: newsLoading, refetch: refetchNews } = useNews({ limit: 5 });
  const { data: countriesData, isLoading: countriesLoading } = useCountries(true);
  const { data: alertsData } = useAlerts();
  
  const fetchNewsMutation = useFetchNews();

  const stats = statsData?.data;
  const latestNews = newsData?.data || [];
  const countries = countriesData?.data || [];
  const alerts = alertsData?.data || [];

  // ترتيب الدول حسب عدد المقالات
  const topCountries = React.useMemo(() => {
    return [...countries]
      .sort((a, b) => (b.stats?.articleCount || b.articleCount) - (a.stats?.articleCount || a.articleCount))
      .slice(0, 5);
  }, [countries]);

  // التنبيهات النشطة
  const activeAlerts = React.useMemo(() => {
    return alerts.filter((a: any) => a.isActive && a.lastTriggered).slice(0, 3);
  }, [alerts]);

  const handleRefresh = async () => {
    toast.promise(fetchNewsMutation.mutateAsync(), {
      loading: 'جاري جلب الأخبار من المصادر...',
      success: (result) => {
        refetchStats();
        refetchNews();
        return `تم جلب ${result.data.summary.totalSaved} خبر جديد`;
      },
      error: 'فشل جلب الأخبار',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            نظرة عامة على آخر المستجدات في العالم العربي
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            مباشر
          </Badge>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={fetchNewsMutation.isPending}
          >
            <RefreshCw className={cn(
              "h-4 w-4 ms-2",
              fetchNewsMutation.isPending && "animate-spin"
            )} />
            تحديث الأخبار
          </Button>
        </div>
      </div>

      {/* Top Banner Ad - مُدار من لوحة الأدمن */}
      <DynamicAd position="HOME_TOP" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">أخبار اليوم</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {(stats?.articlesToday || 0).toLocaleString('ar-EG')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.comparison?.articles !== undefined && (
                    <span className={cn(
                      "flex items-center gap-1",
                      stats.comparison.articles >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      <TrendingUp className="h-3 w-3" />
                      {stats.comparison.articles >= 0 ? '+' : ''}{stats.comparison.articles}% من الأمس
                    </span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">أحداث نشطة</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.eventsToday || 0}</div>
                <p className="text-xs text-muted-foreground">حدث مرصود اليوم</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تنبيهات مفعّلة</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.alertsTriggered || 0}</div>
                <p className="text-xs text-muted-foreground">تنبيه تم تفعيله</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">معالجة AI</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.aiProcessed || 0}%</div>
                <Progress value={stats?.aiProcessed || 0} className="mt-2 h-2" />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest News - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                آخر الأخبار
              </CardTitle>
              <CardDescription>آخر المستجدات من المصادر الموثوقة</CardDescription>
            </div>
            <Link href={`/${locale}/news`}>
              <Button variant="ghost" size="sm">
                عرض الكل
                <ArrowLeft className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pe-4">
              {newsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              ) : latestNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">لا توجد أخبار بعد</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    اضغط على "تحديث الأخبار" لجلب أحدث الأخبار
                  </p>
                  <Button size="sm" onClick={handleRefresh} disabled={fetchNewsMutation.isPending}>
                    <RefreshCw className={cn(
                      "h-4 w-4 me-2",
                      fetchNewsMutation.isPending && "animate-spin"
                    )} />
                    جلب الأخبار
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestNews.map((news, index) => (
                    <div key={news.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group cursor-pointer block"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {news.category && (
                                <Badge variant="outline" className="text-xs">
                                  {categoryLabels[news.category] || news.category}
                                </Badge>
                              )}
                              {news.riskLevel && (
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    news.riskLevel === 'CRITICAL' && "border-red-500 text-red-600",
                                    news.riskLevel === 'HIGH' && "border-orange-500 text-orange-600",
                                    news.riskLevel === 'MEDIUM' && "border-yellow-500 text-yellow-600",
                                  )}
                                >
                                  {riskLabels[news.riskLevel]}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium leading-tight group-hover:text-primary transition-colors">
                              {news.titleAr || news.title}
                            </h3>
                            {news.summary && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {news.summary}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{news.source?.nameAr || news.source?.name}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(news.publishedAt || news.fetchedAt)}</span>
                              {news.country && (
                                <>
                                  <span>•</span>
                                  <span>{news.country.nameAr || news.country.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4" />
                تنبيهات المخاطر
              </CardTitle>
              <Link href={`/${locale}/alerts`}>
                <Button variant="ghost" size="sm">الكل</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  لا توجد تنبيهات نشطة
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {alert.nameAr || alert.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.lastTriggered ? formatTimeAgo(alert.lastTriggered) : 'لم يُفعّل بعد'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                الدول الأكثر ذكراً
              </CardTitle>
              <Link href={`/${locale}/countries`}>
                <Button variant="ghost" size="sm">الكل</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {countriesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : topCountries.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  لا توجد بيانات بعد
                </div>
              ) : (
                <div className="space-y-3">
                  {topCountries.map((country, index) => {
                    const articleCount = country.stats?.articleCount || country.articleCount || 0;
                    const riskLevel = getCountryRiskLevel(country.riskIndex);
                    return (
                      <Link
                        key={country.code}
                        href={`/${locale}/countries/${country.code}`}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {country.flag} {country.nameAr || country.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {articleCount.toLocaleString('ar-EG')} خبر
                          </p>
                        </div>
                        <div className={cn("h-2 w-2 rounded-full", riskColors[riskLevel])} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Ad - مُدار من لوحة الأدمن */}
      <DynamicAd position="HOME_MIDDLE" />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href={`/${locale}/map`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Map className="h-6 w-6" />
                <span>الخريطة التفاعلية</span>
              </Button>
            </Link>
            <Link href={`/${locale}/analytics`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Brain className="h-6 w-6" />
                <span>التحليلات الذكية</span>
              </Button>
            </Link>
            <Link href={`/${locale}/alerts`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>إنشاء تنبيه</span>
              </Button>
            </Link>
            <Link href={`/${locale}/signals`}>
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Activity className="h-6 w-6" />
                <span>الإشارات الذكية</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
