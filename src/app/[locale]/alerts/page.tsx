'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Bell,
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  Globe,
  Tag,
  AlertTriangle,
  Zap,
  Mail,
  Webhook,
  Smartphone,
  Check,
  X,
} from 'lucide-react';

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    name: 'تنبيه الصراعات',
    nameEn: 'Conflict Alert',
    description: 'تنبيه عند حدوث صراعات أو توترات أمنية',
    keywords: ['صراع', 'اشتباك', 'توتر', 'تصعيد'],
    countries: ['سوريا', 'العراق', 'اليمن', 'ليبيا'],
    categories: ['SECURITY', 'POLITICS'],
    riskLevels: ['HIGH', 'CRITICAL'],
    frequency: 'IMMEDIATE',
    channels: ['email', 'push'],
    isActive: true,
    triggerCount: 45,
    lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'تنبيه الاقتصاد',
    nameEn: 'Economy Alert',
    description: 'متابعة الأخبار الاقتصادية المهمة',
    keywords: ['اقتصاد', 'نفط', 'استثمار', 'نمو'],
    countries: ['السعودية', 'الإمارات', 'قطر'],
    categories: ['ECONOMY', 'ENERGY'],
    riskLevels: ['MEDIUM', 'HIGH'],
    frequency: 'DAILY',
    channels: ['email'],
    isActive: true,
    triggerCount: 23,
    lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'تنبيه القمم والمؤتمرات',
    nameEn: 'Summit Alert',
    description: 'تنبيه عند الإعلان عن قمم ومؤتمرات إقليمية',
    keywords: ['قمة', 'مؤتمر', 'اجتماع', 'زيارة رسمية'],
    countries: [],
    categories: ['POLITICS'],
    riskLevels: ['LOW', 'MEDIUM'],
    frequency: 'HOURLY',
    channels: ['push', 'webhook'],
    isActive: false,
    triggerCount: 12,
    lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const frequencyLabels: Record<string, string> = {
  IMMEDIATE: 'فوري',
  HOURLY: 'كل ساعة',
  DAILY: 'يومي',
  WEEKLY: 'أسبوعي',
};

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  push: <Smartphone className="h-4 w-4" />,
  webhook: <Webhook className="h-4 w-4" />,
};

export default function AlertsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const filteredAlerts = mockAlerts.filter((alert) =>
    alert.name.includes(searchQuery) || alert.description.includes(searchQuery)
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">التنبيهات</h1>
          <p className="text-muted-foreground">إدارة التنبيهات المخصصة</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ms-2" />
              إنشاء تنبيه
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء تنبيه جديد</DialogTitle>
              <DialogDescription>حدد معايير التنبيه ليتم تفعيله تلقائياً</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم التنبيه</Label>
                <Input id="name" placeholder="مثال: تنبيه الأخبار العاجلة" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Input id="description" placeholder="وصف مختصر للتنبيه" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                <Input id="keywords" placeholder="مثال: صراع، تصعيد، طوارئ" />
                <p className="text-xs text-muted-foreground">افصل بين الكلمات بفاصلة</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>الدول</Label>
                  <Input placeholder="اختر الدول" />
                </div>
                <div className="grid gap-2">
                  <Label>التصنيفات</Label>
                  <Input placeholder="اختر التصنيفات" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>مستوى المخاطر</Label>
                  <Input placeholder="اختر المستويات" />
                </div>
                <div className="grid gap-2">
                  <Label>التكرار</Label>
                  <Input placeholder="اختر التكرار" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                إنشاء التنبيه
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث في التنبيهات..."
              className="ps-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={cn('card-hover', !alert.isActive && 'opacity-60')}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      alert.isActive ? 'bg-primary/10' : 'bg-muted'
                    )}
                  >
                    <Bell className={cn('h-5 w-5', alert.isActive ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{alert.name}</CardTitle>
                    <CardDescription>{alert.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                    {alert.isActive ? 'نشط' : 'متوقف'}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Keywords */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Tag className="h-4 w-4" />
                    الكلمات المفتاحية
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {alert.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Globe className="h-4 w-4" />
                    الدول
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {alert.countries.length > 0 ? (
                      alert.countries.map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">جميع الدول</span>
                    )}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    التكرار
                  </div>
                  <Badge variant="outline">{frequencyLabels[alert.frequency]}</Badge>
                </div>

                {/* Channels */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Zap className="h-4 w-4" />
                    قنوات الإرسال
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.channels.map((channel) => (
                      <div
                        key={channel}
                        className="p-1.5 rounded bg-muted"
                        title={channel}
                      >
                        {channelIcons[channel]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التفعيلات:</span>
                    <span className="font-medium">{alert.triggerCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">آخر تفعيل:</span>
                    <span className="font-medium">
                      {alert.lastTriggered ? formatTimeAgo(alert.lastTriggered) : 'لم يُفعّل'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    {alert.isActive ? (
                      <>
                        <X className="h-3 w-3" />
                        إيقاف
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3" />
                        تفعيل
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد تنبيهات</h3>
            <p className="text-sm text-muted-foreground mb-4">أنشئ تنبيهك الأول للبدء</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 ms-2" />
              إنشاء تنبيه
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
