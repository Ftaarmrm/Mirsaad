'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  Target,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  BarChart3,
  Layers,
} from 'lucide-react';

// Mock signals data
const mockEscalations = [
  { id: '1', title: 'تصاعد التوترات الحدودية', country: 'سوريا', level: 'CRITICAL', trend: 'up', mentions: 156 },
  { id: '2', title: 'تصعيد عسكري في المنطقة الشمالية', country: 'العراق', level: 'HIGH', trend: 'up', mentions: 98 },
  { id: '3', title: 'احتجاجات متصاعدة', country: 'لبنان', level: 'MEDIUM', trend: 'up', mentions: 67 },
];

const mockMostMentioned = [
  { topic: 'قمة خليجية', mentions: 234, change: 45, direction: 'up' },
  { topic: 'أسعار النفط', mentions: 198, change: 32, direction: 'up' },
  { topic: 'التحول الرقمي', mentions: 167, change: 28, direction: 'up' },
  { topic: 'الصراعات الإقليمية', mentions: 145, change: -12, direction: 'down' },
  { topic: 'الاستثمار الأجنبي', mentions: 134, change: 18, direction: 'up' },
  { topic: 'الأمن السيبراني', mentions: 112, change: 8, direction: 'up' },
];

const mockPatterns = [
  { id: '1', pattern: 'زيادة الإعلانات الرسمية في الصباح', frequency: 85, confidence: 92 },
  { id: '2', pattern: 'تصاعد التصريحات قبل القمم الإقليمية', frequency: 78, confidence: 88 },
  { id: '3', pattern: 'ترابط أخبار الطاقة مع الأحداث السياسية', frequency: 72, confidence: 85 },
  { id: '4', pattern: 'زيادة النشاط الإعلامي في عطلة نهاية الأسبوع', frequency: 65, confidence: 78 },
];

const mockToneShifts = [
  { country: 'السعودية', previousTone: 'محايد', currentTone: 'إيجابي', shift: '+15%', direction: 'up' },
  { country: 'العراق', previousTone: 'سلبي', currentTone: 'محايد', shift: '+8%', direction: 'up' },
  { country: 'سوريا', previousTone: 'سلبي', currentTone: 'سلبي', shift: '-5%', direction: 'down' },
  { country: 'الإمارات', previousTone: 'إيجابي', currentTone: 'إيجابي', shift: '+3%', direction: 'up' },
];

const riskLevelColors: Record<string, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

export default function SignalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">الإشارات الذكية</h1>
          <p className="text-muted-foreground">الأنماط والاتجاهات الناشئة</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Radio className="h-3 w-3" />
            تحديث لحظي
          </Badge>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Escalations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              التصاعدات
            </CardTitle>
            <CardDescription>أحداث متصاعدة تتطلب متابعة فورية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEscalations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-3 h-3 rounded-full', riskLevelColors[item.level])} />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-sm font-medium">{item.mentions} ذكر</p>
                      <Badge variant="outline" className="text-xs">
                        {item.level === 'CRITICAL' ? 'حرج' : item.level === 'HIGH' ? 'عالي' : 'متوسط'}
                      </Badge>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Mentioned */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              الأكثر ذكراً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {mockMostMentioned.map((item, index) => (
                  <div key={item.topic} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-4">{index + 1}.</span>
                      <span className="text-sm font-medium">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.mentions}</span>
                      {item.direction === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              الأنماط المتكررة
            </CardTitle>
            <CardDescription>أنماط تم رصدها في البيانات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPatterns.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.pattern}</p>
                    <Badge variant="outline" className="text-xs">
                      ثقة {item.confidence}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.frequency}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.frequency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tone Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              تغيّر النبرة الإعلامية
            </CardTitle>
            <CardDescription>تحولات في نبرة الخطاب الإعلامي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockToneShifts.map((item) => (
                <div
                  key={item.country}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{item.country}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.previousTone} → {item.currentTone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        item.direction === 'up' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                      )}
                    >
                      {item.shift}
                    </Badge>
                    {item.direction === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Signals & Opportunity Signals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Signals */}
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              إشارات المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">تصاعد التوترات الحدودية</p>
                  <p className="text-xs text-muted-foreground">زيادة 45% في التقارير الأمنية</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">تقلبات أسعار النفط</p>
                  <p className="text-xs text-muted-foreground">تأثير محتمل على الاقتصادات الإقليمية</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">احتجاجات مستمرة</p>
                  <p className="text-xs text-muted-foreground">استمرار الاحتجاجات في عدة مناطق</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunity Signals */}
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Target className="h-5 w-5" />
              إشارات الفرص
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">نمو الاستثمارات التقنية</p>
                  <p className="text-xs text-muted-foreground">زيادة 32% في الاستثمارات التقنية</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">مبادرات الطاقة المتجددة</p>
                  <p className="text-xs text-muted-foreground">فرص استثمارية جديدة</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">تحسن العلاقات الدبلوماسية</p>
                  <p className="text-xs text-muted-foreground">توقعات إيجابية للتعاون الإقليمي</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
