'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  User,
  Palette,
  Bell,
  Globe,
  Shield,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [theme, setTheme] = React.useState('system');
  const [language, setLanguage] = React.useState('ar');
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    sound: false,
    desktop: true,
  });
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص تجربتك في المنصة</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            الملف الشخصي
          </CardTitle>
          <CardDescription>إعدادات حسابك الشخصي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" placeholder="أدخل اسمك" defaultValue="محمد أحمد" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@email.com" defaultValue="mohammed@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">المؤسسة</Label>
            <Input id="organization" placeholder="اسم المؤسسة (اختياري)" />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            المظهر
          </CardTitle>
          <CardDescription>تخصيص شكل واجهة المنصة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>السمة</Label>
            <div className="flex gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex-1 justify-start"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 ms-2" />
                فاتح
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex-1 justify-start"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 ms-2" />
                داكن
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex-1 justify-start"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-4 w-4 ms-2" />
                النظام
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">اللغة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
          </CardTitle>
          <CardDescription>إدارة إعدادات الإشعارات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">استلام الإشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات الهاتف</Label>
              <p className="text-sm text-muted-foreground">استلام الإشعارات على هاتفك</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>صوت الإشعارات</Label>
              <p className="text-sm text-muted-foreground">تشغيل صوت عند وصول إشعار جديد</p>
            </div>
            <Switch
              checked={notifications.sound}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, sound: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات سطح المكتب</Label>
              <p className="text-sm text-muted-foreground">عرض الإشعارات على سطح المكتب</p>
            </div>
            <Switch
              checked={notifications.desktop}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, desktop: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferred Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            المحتوى المفضل
          </CardTitle>
          <CardDescription>تخصيص المحتوى المعروض</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الدول المفضلة</Label>
            <Input placeholder="اختر الدول المتابعة" />
            <p className="text-xs text-muted-foreground">سيتم إبراز أخبار هذه الدول في لوحة التحكم</p>
          </div>
          <div className="space-y-2">
            <Label>المواضيع المفضلة</Label>
            <Input placeholder="اختر المواضيع المتابعة" />
            <p className="text-xs text-muted-foreground">سيتم إبراز الأخبار المتعلقة بهذه المواضيع</p>
          </div>
          <div className="space-y-2">
            <Label>مصادر الأخبار</Label>
            <Input placeholder="اختر مصادر الأخبار المفضلة" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الخصوصية والأمان
          </CardTitle>
          <CardDescription>إعدادات الأمان والخصوصية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تاريخ البحث</Label>
              <p className="text-sm text-muted-foreground">حفظ تاريخ البحث لتحسين الاقتراحات</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>التحليلات</Label>
              <p className="text-sm text-muted-foreground">المساعدة في تحسين المنصة عبر تحليلات مجهولة</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="pt-2">
            <Button variant="outline" className="text-destructive hover:text-destructive">
              حذف جميع البيانات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          إعادة ضبط
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? 'تم الحفظ!' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
}
