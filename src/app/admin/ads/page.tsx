'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MousePointerClick,
  Settings,
  ArrowRight,
  Layers,
  LogOut,
  Home,
  Search,
  Power,
  PowerOff,
} from 'lucide-react';

// ============================================
// Types
// ============================================

const POSITIONS = [
  { value: 'HOME_TOP', label: 'الصفحة الرئيسية - أعلى', group: 'الرئيسية' },
  { value: 'HOME_MIDDLE', label: 'الصفحة الرئيسية - وسط', group: 'الرئيسية' },
  { value: 'HOME_SIDEBAR', label: 'الصفحة الرئيسية - جانبي', group: 'الرئيسية' },
  { value: 'HOME_BOTTOM', label: 'الصفحة الرئيسية - أسفل', group: 'الرئيسية' },
  { value: 'NEWS_TOP', label: 'صفحة الأخبار - أعلى', group: 'الأخبار' },
  { value: 'NEWS_INFEED', label: 'صفحة الأخبار - داخل القائمة', group: 'الأخبار' },
  { value: 'NEWS_SIDEBAR', label: 'صفحة الأخبار - جانبي', group: 'الأخبار' },
  { value: 'NEWS_BOTTOM', label: 'صفحة الأخبار - أسفل', group: 'الأخبار' },
  { value: 'ARTICLE_TOP', label: 'صفحة المقال - أعلى', group: 'المقال' },
  { value: 'ARTICLE_INLINE', label: 'صفحة المقال - داخل المقال', group: 'المقال' },
  { value: 'ARTICLE_BOTTOM', label: 'صفحة المقال - أسفل', group: 'المقال' },
  { value: 'COUNTRY_TOP', label: 'صفحة الدولة - أعلى', group: 'الدول' },
  { value: 'COUNTRY_BOTTOM', label: 'صفحة الدولة - أسفل', group: 'الدول' },
  { value: 'ANALYTICS_TOP', label: 'صفحة التحليلات - أعلى', group: 'التحليلات' },
  { value: 'ANALYTICS_BOTTOM', label: 'صفحة التحليلات - أسفل', group: 'التحليلات' },
  { value: 'FOOTER', label: 'الذيل', group: 'عام' },
  { value: 'CUSTOM', label: 'مخصص', group: 'عام' },
];

const FORMATS = [
  { value: 'AUTO', label: 'تلقائي (Auto)', description: 'يتكيف مع المساحة المتاحة' },
  { value: 'RECTANGLE', label: 'مستطيل (Rectangle)', description: '300×250 أو 336×280' },
  { value: 'HORIZONTAL', label: 'أفقي (Banner)', description: '728×90 أو 970×90' },
  { value: 'VERTICAL', label: 'عمودي (Skyscraper)', description: '160×600 أو 300×600' },
  { value: 'SQUARE', label: 'مربع (Square)', description: '250×250 أو 200×200' },
  { value: 'FLUID', label: 'مرن (Fluid)', description: 'للـ in-article و in-feed' },
];

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  slotId: string;
  clientId?: string;
  position: string;
  format: string;
  width?: number;
  height?: number;
  responsive: boolean;
  layout?: string;
  layoutKey?: string;
  isActive: boolean;
  priority: number;
  showLabel: boolean;
  labelText: string;
  viewCount: number;
  clickCount: number;
  lastShown?: string;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: '',
  description: '',
  slotId: '',
  position: 'HOME_TOP',
  format: 'AUTO',
  width: '',
  height: '',
  responsive: true,
  layout: '',
  layoutKey: '',
  isActive: true,
  priority: 0,
  showLabel: true,
  labelText: 'إعلان',
};

// ============================================
// Main Page
// ============================================

export default function AdminAdsPage() {
  const router = useRouter();
  const [ads, setAds] = React.useState<AdSlot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [positionFilter, setPositionFilter] = React.useState<string>('all');
  
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAd, setEditingAd] = React.useState<AdSlot | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [saving, setSaving] = React.useState(false);

  // ============================================
  // Fetch Ads
  // ============================================
  
  const fetchAds = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ads?activeOnly=false');
      const data = await res.json();
      if (data.success) {
        setAds(data.data);
      }
    } catch (err) {
      toast.error('فشل جلب الإعلانات');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // ============================================
  // CRUD Operations
  // ============================================

  const openCreateDialog = () => {
    setEditingAd(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (ad: AdSlot) => {
    setEditingAd(ad);
    setForm({
      name: ad.name,
      description: ad.description || '',
      slotId: ad.slotId,
      position: ad.position,
      format: ad.format,
      width: ad.width?.toString() || '',
      height: ad.height?.toString() || '',
      responsive: ad.responsive,
      layout: ad.layout || '',
      layoutKey: ad.layoutKey || '',
      isActive: ad.isActive,
      priority: ad.priority,
      showLabel: ad.showLabel,
      labelText: ad.labelText,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slotId.trim()) {
      toast.error('الاسم و Slot ID مطلوبان');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        width: form.width ? parseInt(form.width) : undefined,
        height: form.height ? parseInt(form.height) : undefined,
        priority: Number(form.priority),
      };

      const url = editingAd ? `/api/admin/ads/${editingAd.id}` : '/api/admin/ads';
      const method = editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'فشل الحفظ');
      }

      toast.success(editingAd ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح');
      setDialogOpen(false);
      fetchAds();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message);
      
      toast.success('تم الحذف بنجاح');
      fetchAds();
    } catch (err) {
      toast.error('فشل الحذف');
    }
  };

  const handleToggleActive = async (ad: AdSlot) => {
    try {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      
      if (!res.ok) throw new Error();
      
      toast.success(ad.isActive ? 'تم التعطيل' : 'تم التفعيل');
      fetchAds();
    } catch (err) {
      toast.error('فشل التحديث');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  // ============================================
  // Filtered Ads
  // ============================================
  
  const filteredAds = ads.filter(ad => {
    if (search && !ad.name.toLowerCase().includes(search.toLowerCase()) && 
        !ad.slotId.includes(search)) {
      return false;
    }
    if (positionFilter !== 'all' && ad.position !== positionFilter) {
      return false;
    }
    return true;
  });

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.isActive).length,
    totalViews: ads.reduce((sum, a) => sum + a.viewCount, 0),
    totalClicks: ads.reduce((sum, a) => sum + a.clickCount, 0),
  };

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link href="/" className="hover:text-foreground flex items-center gap-1">
                <Home className="h-3 w-3" />
                الرئيسية
              </Link>
              <ArrowRight className="h-3 w-3 rotate-180" />
              <span>لوحة الأدمن</span>
              <ArrowRight className="h-3 w-3 rotate-180" />
              <span>الإعلانات</span>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Layers className="h-7 w-7" />
              إدارة الإعلانات
            </h1>
            <p className="text-muted-foreground mt-1">
              أضف وعدّل وحدات إعلانات AdSense مع تحكم كامل بالمقاسات والمواضع
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreateDialog} size="lg">
              <Plus className="h-4 w-4 me-2" />
              إضافة إعلان
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} title="تسجيل الخروج">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإعلانات</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المفعّلة</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Power className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المشاهدات</p>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString('ar-EG')}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">النقرات</p>
                  <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString('ar-EG')}</p>
                </div>
                <MousePointerClick className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم أو Slot ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-9"
                />
              </div>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="كل المواضع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المواضع</SelectItem>
                  {POSITIONS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ads List */}
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">جاري التحميل...</CardContent></Card>
        ) : filteredAds.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center text-center">
              <Layers className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {ads.length === 0 ? 'لا توجد إعلانات بعد' : 'لا توجد نتائج'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {ads.length === 0 
                  ? 'أضف أول إعلان AdSense لتبدأ' 
                  : 'جرّب تغيير معايير البحث'}
              </p>
              {ads.length === 0 && (
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 me-2" />
                  إضافة إعلان
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAds.map(ad => (
              <Card key={ad.id} className={cn(!ad.isActive && 'opacity-60')}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lg">{ad.name}</h3>
                        <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                          {ad.isActive ? '✓ مفعّل' : '○ معطّل'}
                        </Badge>
                        <Badge variant="outline">
                          {POSITIONS.find(p => p.value === ad.position)?.label || ad.position}
                        </Badge>
                        <Badge variant="outline">
                          {FORMATS.find(f => f.value === ad.format)?.label || ad.format}
                        </Badge>
                        {ad.width && ad.height && (
                          <Badge variant="outline">
                            {ad.width}×{ad.height}
                          </Badge>
                        )}
                      </div>
                      
                      {ad.description && (
                        <p className="text-sm text-muted-foreground">{ad.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Slot ID</p>
                          <p className="font-mono">{ad.slotId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الأولوية</p>
                          <p>{ad.priority}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">المشاهدات</p>
                          <p>{ad.viewCount.toLocaleString('ar-EG')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">النقرات</p>
                          <p>{ad.clickCount.toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(ad)}
                        title={ad.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {ad.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(ad)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف الإعلان "{ad.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ad.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل وحدة الإعلان AdSense
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">اسم الإعلان <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثلاً: بانر الصفحة الرئيسية"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف اختياري للإعلان"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slotId">Slot ID من AdSense <span className="text-red-500">*</span></Label>
              <Input
                id="slotId"
                value={form.slotId}
                onChange={(e) => setForm({ ...form, slotId: e.target.value })}
                placeholder="1234567890"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                ستحصل عليه من لوحة تحكم AdSense عند إنشاء وحدة إعلانية
              </p>
            </div>

            {/* Position & Format */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">الموضع <span className="text-red-500">*</span></Label>
                <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">التنسيق</Label>
                <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORMATS.map(f => (
                      <SelectItem key={f.value} value={f.value}>
                        <div>
                          <div>{f.label}</div>
                          <div className="text-xs text-muted-foreground">{f.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">العرض (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={form.width}
                  onChange={(e) => setForm({ ...form, width: e.target.value })}
                  placeholder="اتركه فارغاً للمتجاوب"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">الارتفاع (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  placeholder="اتركه فارغاً للمتجاوب"
                />
              </div>
            </div>

            {/* Advanced - Fluid */}
            {form.format === 'FLUID' && (
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium">إعدادات Fluid Ads</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout</Label>
                    <Select value={form.layout || 'none'} onValueChange={(v) => setForm({ ...form, layout: v === 'none' ? '' : v })}>
                      <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                        <SelectItem value="in-article">in-article</SelectItem>
                        <SelectItem value="in-feed">in-feed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="layoutKey">Layout Key</Label>
                    <Input
                      id="layoutKey"
                      value={form.layoutKey}
                      onChange={(e) => setForm({ ...form, layoutKey: e.target.value })}
                      placeholder="-fb+5w+4e-db+86"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Input
                  id="priority"
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="labelText">نص التسمية</Label>
                <Input
                  id="labelText"
                  value={form.labelText}
                  onChange={(e) => setForm({ ...form, labelText: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="responsive">إعلان متجاوب</Label>
                  <p className="text-xs text-muted-foreground">يتكيف تلقائياً مع حجم الشاشة</p>
                </div>
                <Switch
                  id="responsive"
                  checked={form.responsive}
                  onCheckedChange={(c) => setForm({ ...form, responsive: c })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="showLabel">إظهار التسمية</Label>
                  <p className="text-xs text-muted-foreground">إظهار "إعلان" فوق الوحدة</p>
                </div>
                <Switch
                  id="showLabel"
                  checked={form.showLabel}
                  onCheckedChange={(c) => setForm({ ...form, showLabel: c })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="isActive">مفعّل</Label>
                  <p className="text-xs text-muted-foreground">الإعلان يظهر على الموقع</p>
                </div>
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(c) => setForm({ ...form, isActive: c })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'جاري الحفظ...' : (editingAd ? 'تحديث' : 'إنشاء')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
