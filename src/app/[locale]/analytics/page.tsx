'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Eye,
} from 'lucide-react';

// Mock analytics data
const mockInsights = [
  {
    id: '1',
    type: 'TREND',
    title: 'تصاعد التوترات الحدودية',
    titleEn: 'Escalating Border Tensions',
    content: 'لوحظ تصاعد ملحوظ في التوترات الحدودية خلال الـ 48 ساعة الماضية، مع زيادة 35% في التقارير المتعلقة بالمناوشات.',
    confidence: 87,
    severity: 'HIGH',
    relatedCountries: ['سوريا', 'العراق'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'ANOMALY',
    title: 'زيادة غير مسبوقة في الإعلانات الرسمية',
    titleEn: 'Unprecedented Increase in Official Announcements',
    content: 'تم رصد زيادة 200% في الإعلانات الحكومية خلال الأسبوع الحالي مقارنة بالمتوسط الشهري.',
    confidence: 92,
    severity: 'MEDIUM',
    relatedCountries: ['السعودية', 'الإمارات'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'PREDICTION',
    title: 'توقع اجتماعات رفيعة المستوى',
    titleEn: 'High-Level Meetings Predicted',
    content: 'بناءً على أنماط الحركة والتصريحات، من المتوقع عقد اجتماعات رفيعة المستوى خلال الأيام القادمة.',
    confidence: 75,
    severity: 'LOW',
    relatedCountries: ['مصر', 'الأردن'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'CONNECTION',
    title: 'ربط أحداث متفرقة',
    titleEn: 'Connecting Disparate Events',
    content: 'تم ربط سلسلة من الأحداث المتفرقة تشير إلى تنسيق إقليمي غير معلن حول ملفات اقتصادية مشتركة.',
    confidence: 68,
    severity: 'MEDIUM',
    relatedCountries: ['قطر', 'البحرين', 'الكويت'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTrends = [
  { topic: 'الطاقة المتجددة', count: 156, change: 45, direction: 'up' },
  { topic: 'التحول الرقمي', count: 134, change: 32, direction: 'up' },
  { topic: 'الصراعات الإقليمية', count: 128, change: -12, direction: 'down' },
  { topic: 'الاستثمار الأجنبي', count: 98, change: 28, direction: 'up' },
  { topic: 'الأمن السيبراني', count: 87, change: 15, direction: 'up' },
];

const mockCategoryStats = [
  { category: 'سياسة', count: 456, percentage: 35, color: 'bg-primary' },
  { category: 'اقتصاد', count: 312, percentage: 24, color: 'bg-yellow-500' },
  { category: 'أمن', count: 234, percentage: 18, color: 'bg-red-500' },
  { category: 'طاقة', count: 156, percentage: 12, color: 'bg-orange-500' },
  { category: 'تقنية', count: 134, percentage: 10, color: 'bg-purple-500' },
];

const mockDailySummary = {
  title: 'ملخص اليوم التنفيذي',
  content: `شهد اليوم حركة دبلوماسية مكثفة في المنطقة، حيث عقدت عدة اجتماعات ثنائية ومتعددة الأطراف. 

النقاط الرئيسية:
• قمة خليجية طارئة لمناقشة التطورات الإقليمية
• ارتفاع أسعار النفط بنسبة 3.2% وسط المخاوف من تأثر الإمدادات
• إعلان مبادرات تقنية مشتركة بين دول الخليج
• توقعات بنمو اقتصادي إيجابي للمنطقة

التوصيات:
• متابعة تطورات القمة الخليجية ونتائجها
• مراقبة تأثير التوترات على أسواق الطاقة
• التركيز على الفرص الاستثمارية الناشئة`,
  generatedAt: new Date().toISOString(),
};

const insightTypeLabels: Record<string, string> = {
  SUMMARY: 'ملخص',
  TREND: 'اتجاه',
  ANOMALY: 'شذوذ',
  PREDICTION: 'توقع',
  CONNECTION: 'ربط',
  RECOMMENDATION: 'توصية',
};

const insightTypeColors: Record<string, string> = {
  SUMMARY: 'bg-blue-100 text-blue-800',
  TREND: 'bg-green-100 text-green-800',
  ANOMALY: 'bg-orange-100 text-orange-800',
  PREDICTION: 'bg-purple-100 text-purple-800',
  CONNECTION: 'bg-cyan-100 text-cyan-800',
  RECOMMENDATION: 'bg-pink-100 text-pink-800',
};

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [isRegenerating, setIsRegenerating] = React.useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRegenerating(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${Math.floor(diffHours / 24)} يوم`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">التحليلات الذكية</h1>
          <p className="text-muted-foreground">رؤى مستندة إلى الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Brain className="h-3 w-3" />
            AI Powered
          </Badge>
          <Button onClick={handleRegenerate} disabled={isRegenerating}>
            {isRegenerating ? (
              <RefreshCw className="h-4 w-4 ms-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 ms-2" />
            )}
            تحديث التحليلات
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>{mockDailySummary.title}</CardTitle>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(mockDailySummary.generatedAt)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {mockDailySummary.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              الرؤى الذكية
            </CardTitle>
            <CardDescription>تحليلات مستخرجة من البيانات الأخيرة</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pe-4">
              <div className="space-y-4">
                {mockInsights.map((insight) => (
                  <Card key={insight.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={insightTypeColors[insight.type]}>
                            {insightTypeLabels[insight.type]}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              insight.severity === 'LOW' && 'border-green-500 text-green-600',
                              insight.severity === 'MEDIUM' && 'border-yellow-500 text-yellow-600',
                              insight.severity === 'HIGH' && 'border-orange-500 text-orange-600',
                              insight.severity === 'CRITICAL' && 'border-red-500 text-red-600'
                            )}
                          >
                            {insight.severity === 'LOW' ? 'منخفض' : insight.severity === 'MEDIUM' ? 'متوسط' : insight.severity === 'HIGH' ? 'عالي' : 'حرج'}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(insight.createdAt)}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{insight.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {insight.relatedCountries.map((country) => (
                            <Badge key={country} variant="secondary" className="text-xs">
                              {country}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-muted-foreground">الثقة:</span>
                          <span className="font-medium">{insight.confidence}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trends */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                المواضيع الرائجة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTrends.map((trend, index) => (
                  <div key={trend.topic} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-4">{index + 1}.</span>
                      <span className="text-sm font-medium">{trend.topic}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">{trend.count}</span>
                      {trend.direction === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4" />
                توزيع التصنيفات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCategoryStats.map((stat) => (
                  <div key={stat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{stat.category}</span>
                      <span className="text-muted-foreground">{stat.count}</span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" />
                إحصائيات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">1,247</p>
                  <p className="text-xs text-muted-foreground">خبر اليوم</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">45</p>
                  <p className="text-xs text-muted-foreground">حدث نشط</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">18</p>
                  <p className="text-xs text-muted-foreground">دولة متابعة</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">98%</p>
                  <p className="text-xs text-muted-foreground">AI معالج</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What Changed Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            ما الذي تغيّر خلال 24 ساعة؟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">زيادات ملحوظة</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• الأخبار الاقتصادية +35%</li>
                <li>• الاجتماعات الرسمية +28%</li>
                <li>• تصريحات الطاقة +22%</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-600">انخفاضات ملحوظة</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• الأحداث الأمنية -15%</li>
                <li>• الاحتجاجات -12%</li>
                <li>• التصريحات الحادة -8%</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-600">تنبيهات جديدة</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 3 تنبيهات مخاطر جديدة</li>
                <li>• 5 أحداث متصاعدة</li>
                <li>• 2 شذوذ في الأنماط</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
