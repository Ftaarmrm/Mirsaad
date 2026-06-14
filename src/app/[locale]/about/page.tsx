'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Radio,
  Target,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Brain,
  Map,
  Bell,
  Newspaper,
  Users,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
} from 'lucide-react';

const features = [
  {
    icon: Newspaper,
    title: 'تجميع الأخبار',
    titleEn: 'News Aggregation',
    description: 'تجميع الأخبار من مصادر موثوقة متعددة في وقت واحد',
  },
  {
    icon: Map,
    title: 'خريطة تفاعلية',
    titleEn: 'Interactive Map',
    description: 'عرض الأحداث والأخبار على خريطة تفاعلية للعالم العربي',
  },
  {
    icon: Brain,
    title: 'تحليلات ذكية',
    titleEn: 'AI Analytics',
    description: 'تحليلات ورؤى مستندة إلى الذكاء الاصطناعي',
  },
  {
    icon: Bell,
    title: 'تنبيهات مخصصة',
    titleEn: 'Custom Alerts',
    description: 'تنبيهات فورية بناءً على اهتماماتك',
  },
  {
    icon: Globe,
    title: 'غطاء شامل',
    titleEn: 'Comprehensive Coverage',
    description: 'متابعة 18 دولة عربية عبر قطاعات متعددة',
  },
  {
    icon: Shield,
    title: 'مصداقية المصادر',
    titleEn: 'Source Credibility',
    description: 'تصنيف المصادر حسب المصداقية والموثوقية',
  },
];

const technologies = [
  { name: 'Next.js 16', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Prisma', category: 'Database' },
  { name: 'Zustand', category: 'State Management' },
  { name: 'Recharts', category: 'Charts' },
  { name: 'MapLibre GL', category: 'Maps' },
  { name: 'z-ai-sdk', category: 'AI' },
];

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Radio className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">مِرصاد</h1>
        <p className="text-xl text-muted-foreground">نافذتك على العالم العربي</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">v1.0.0</Badge>
          <Badge variant="outline">Open Source</Badge>
        </div>
      </div>

      {/* Mission */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            رسالتنا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            توفير منصة عربية متقدمة لرصد وتحليل الأخبار والأحداث في العالم العربي، تمكّن
            الباحثين والمحللين وغرف الأخبار من اتخاذ قرارات مستنيرة بناءً على بيانات دقيقة
            وتحليلات ذكية.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          المميزات
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            الجمهور المستهدف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Newspaper className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">باحثون ومحللو سياسات</p>
                <p className="text-sm text-muted-foreground">تحليل وتتبع التطورات الإقليمية</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">غرف الأخبار</p>
                <p className="text-sm text-muted-foreground">رصد إعلامي لحظي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">جهات حكومية</p>
                <p className="text-sm text-muted-foreground">متابعة ومتابعة المخاطر</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">مراكز الدراسات</p>
                <p className="text-sm text-muted-foreground">بحث وتحليل معمق</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <div>
        <h2 className="text-2xl font-bold mb-4">التقنيات المستخدمة</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech.name} variant="secondary" className="text-sm py-1 px-3">
              {tech.name}
              <span className="text-muted-foreground ms-2 text-xs">({tech.category})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">18</p>
            <p className="text-sm text-muted-foreground">دولة عربية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="text-sm text-muted-foreground">مصدر أخبار</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">1000+</p>
            <p className="text-sm text-muted-foreground">خبر يومياً</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">رصد مستمر</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Contact & Social */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground">تواصل معنا</p>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="mailto:contact@mirsad.io">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p className="flex items-center justify-center gap-1">
          صُنع بـ <Heart className="h-4 w-4 text-red-500" /> للعالم العربي
        </p>
        <p className="mt-2">© {new Date().getFullYear()} مِرصاد. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
}
