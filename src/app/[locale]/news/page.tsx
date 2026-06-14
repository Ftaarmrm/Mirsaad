'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Newspaper,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Eye,
  Bookmark,
  Share2,
  ExternalLink,
  Brain,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useNews, useFetchNews, type Article } from '@/hooks/use-api';
import { toast } from 'sonner';
import { DynamicAd } from '@/components/ads/dynamic-ad';

const categories = [
  { value: 'all', label: 'كل التصنيفات' },
  { value: 'POLITICS', label: 'سياسة' },
  { value: 'ECONOMY', label: 'اقتصاد' },
  { value: 'SECURITY', label: 'أمن' },
  { value: 'TECHNOLOGY', label: 'تقنية' },
  { value: 'ENERGY', label: 'طاقة' },
  { value: 'HEALTH', label: 'صحة' },
  { value: 'ENVIRONMENT', label: 'بيئة' },
  { value: 'SPORTS', label: 'رياضة' },
  { value: 'CULTURE', label: 'ثقافة' },
];

const riskLevels = [
  { value: 'all', label: 'كل المستويات', color: '' },
  { value: 'LOW', label: 'منخفض', color: 'bg-green-500' },
  { value: 'MEDIUM', label: 'متوسط', color: 'bg-yellow-500' },
  { value: 'HIGH', label: 'عالي', color: 'bg-orange-500' },
  { value: 'CRITICAL', label: 'حرج', color: 'bg-red-500' },
];

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

const riskLabels: Record<string, string> = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};

const riskColors: Record<string, string> = {
  LOW: 'border-green-500 text-green-600',
  MEDIUM: 'border-yellow-500 text-yellow-600',
  HIGH: 'border-orange-500 text-orange-600',
  CRITICAL: 'border-red-500 text-red-600',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 30) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString('ar-EG');
}

export default function NewsPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedRisk, setSelectedRisk] = React.useState('all');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // جلب الأخبار من API الحقيقي
  const { data, isLoading, isError, error, refetch, isFetching } = useNews({
    search: debouncedSearch || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    riskLevel: selectedRisk !== 'all' ? selectedRisk : undefined,
    limit: 30,
  });

  // Mutation لجلب أخبار جديدة من RSS
  const fetchNewsMutation = useFetchNews();

  const articles: Article[] = data?.data || [];
  const total = data?.meta?.total || 0;

  const handleRefreshNews = async () => {
    toast.promise(fetchNewsMutation.mutateAsync(), {
      loading: 'جاري جلب الأخبار من المصادر...',
      success: (result) => {
        const saved = result.data.summary.totalSaved;
        const sources = result.data.summary.sources;
        return `تم جلب ${saved} خبر جديد من ${sources} مصدر`;
      },
      error: 'فشل جلب الأخبار',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">الأخبار المباشرة</h1>
          <p className="text-muted-foreground">تدفق الأخبار اللحظي من المصادر الموثوقة</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isFetching ? "bg-yellow-500 animate-pulse" : "bg-green-500 animate-pulse"
            )} />
            {isFetching ? 'تحديث...' : 'مباشر'}
          </Badge>
          <span className="text-sm text-muted-foreground">{total} خبر</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshNews}
            disabled={fetchNewsMutation.isPending}
          >
            <RefreshCw className={cn(
              "h-4 w-4 me-2",
              fetchNewsMutation.isPending && "animate-spin"
            )} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث في الأخبار..."
                className="ps-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 ms-2" />
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-[150px]">
                  <AlertTriangle className="h-4 w-4 ms-2" />
                  <SelectValue placeholder="المخاطر" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk.value} value={risk.value}>
                      <div className="flex items-center gap-2">
                        {risk.color && <div className={cn('h-2 w-2 rounded-full', risk.color)} />}
                        {risk.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-8" />

              <div className="flex items-center rounded-lg border">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-e-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-s-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <Card className="border-red-500">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium">حدث خطأ في جلب الأخبار</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'حدث خطأ غير متوقع'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 me-2" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-32 w-48 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Top Banner Ad - مُدار من لوحة الأدمن */}
      <DynamicAd position="NEWS_TOP" />

      {/* News List/Grid */}
      {!isLoading && !isError && articles.length > 0 && (
        viewMode === 'list' ? (
          <div className="space-y-4">
            {articles.map((news, index) => (
              <React.Fragment key={news.id}>
                <Card className="card-hover overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {news.imageUrl && (
                    <div className="md:w-64 h-48 md:h-auto shrink-0">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {news.category && (
                            <Badge variant="outline">
                              {categoryLabels[news.category] || news.category}
                            </Badge>
                          )}
                          {news.riskLevel && (
                            <Badge variant="outline" className={riskColors[news.riskLevel]}>
                              {riskLabels[news.riskLevel]}
                            </Badge>
                          )}
                          {news.aiProcessed && (
                            <Badge variant="secondary" className="gap-1">
                              <Brain className="h-3 w-3" />
                              AI
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold leading-tight">
                          {news.titleAr || news.title}
                        </h3>
                        {news.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {news.summary}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          {news.source && (
                            <span className="flex items-center gap-1">
                              <Newspaper className="h-3 w-3" />
                              {news.source.nameAr || news.source.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(news.publishedAt || news.fetchedAt)}
                          </span>
                          {news.viewCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {news.viewCount.toLocaleString('ar-EG')}
                            </span>
                          )}
                          {news.country && (
                            <span>📍 {news.country.nameAr || news.country.name}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" title="حفظ">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="مشاركة">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="فتح المصدر"
                          asChild
                        >
                          <a href={news.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                </Card>
                {/* إعلان كل 6 مقالات - مُدار من لوحة الأدمن */}
                {(index + 1) % 6 === 0 && index < articles.length - 1 && (
                  <DynamicAd position="NEWS_INFEED" />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((news) => (
              <Card key={news.id} className="card-hover overflow-hidden">
                {news.imageUrl && (
                  <div className="h-40">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <CardHeader className="p-4 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {news.category && (
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[news.category]}
                      </Badge>
                    )}
                    {news.riskLevel && (
                      <Badge variant="outline" className={cn('text-xs', riskColors[news.riskLevel])}>
                        {riskLabels[news.riskLevel]}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {news.titleAr || news.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  {news.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {news.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{news.source?.nameAr || news.source?.name || ''}</span>
                    <span>{formatTimeAgo(news.publishedAt || news.fetchedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Empty State */}
      {!isLoading && !isError && articles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد أخبار حالياً</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              {debouncedSearch || selectedCategory !== 'all' || selectedRisk !== 'all'
                ? 'جرب تغيير معايير البحث أو الفلاتر'
                : 'اضغط على زر التحديث لجلب أحدث الأخبار من المصادر'}
            </p>
            <Button onClick={handleRefreshNews} disabled={fetchNewsMutation.isPending}>
              <RefreshCw className={cn(
                "h-4 w-4 me-2",
                fetchNewsMutation.isPending && "animate-spin"
              )} />
              جلب الأخبار الآن
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
