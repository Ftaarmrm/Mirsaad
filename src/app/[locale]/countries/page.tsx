'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Newspaper,
  Users,
  ArrowLeft,
} from 'lucide-react';

// Mock countries data
const mockCountries = [
  { code: 'SA', name: 'السعودية', nameEn: 'Saudi Arabia', region: 'gulf', flag: '🇸🇦', articleCount: 156, eventCount: 23, riskLevel: 'LOW', trend: 'stable', riskIndex: 25, stabilityIndex: 78 },
  { code: 'AE', name: 'الإمارات', nameEn: 'UAE', region: 'gulf', flag: '🇦🇪', articleCount: 124, eventCount: 15, riskLevel: 'LOW', trend: 'up', riskIndex: 20, stabilityIndex: 85 },
  { code: 'EG', name: 'مصر', nameEn: 'Egypt', region: 'northAfrica', flag: '🇪🇬', articleCount: 98, eventCount: 31, riskLevel: 'MEDIUM', trend: 'down', riskIndex: 45, stabilityIndex: 62 },
  { code: 'IQ', name: 'العراق', nameEn: 'Iraq', region: 'levant', flag: '🇮🇶', articleCount: 87, eventCount: 45, riskLevel: 'HIGH', trend: 'up', riskIndex: 72, stabilityIndex: 38 },
  { code: 'SY', name: 'سوريا', nameEn: 'Syria', region: 'levant', flag: '🇸🇾', articleCount: 76, eventCount: 67, riskLevel: 'CRITICAL', trend: 'up', riskIndex: 88, stabilityIndex: 15 },
  { code: 'JO', name: 'الأردن', nameEn: 'Jordan', region: 'levant', flag: '🇯🇴', articleCount: 54, eventCount: 12, riskLevel: 'LOW', trend: 'stable', riskIndex: 30, stabilityIndex: 72 },
  { code: 'LB', name: 'لبنان', nameEn: 'Lebanon', region: 'levant', flag: '🇱🇧', articleCount: 62, eventCount: 28, riskLevel: 'HIGH', trend: 'up', riskIndex: 68, stabilityIndex: 25 },
  { code: 'KW', name: 'الكويت', nameEn: 'Kuwait', region: 'gulf', flag: '🇰🇼', articleCount: 43, eventCount: 8, riskLevel: 'LOW', trend: 'stable', riskIndex: 22, stabilityIndex: 80 },
  { code: 'QA', name: 'قطر', nameEn: 'Qatar', region: 'gulf', flag: '🇶🦾', articleCount: 51, eventCount: 10, riskLevel: 'LOW', trend: 'up', riskIndex: 18, stabilityIndex: 88 },
  { code: 'BH', name: 'البحرين', nameEn: 'Bahrain', region: 'gulf', flag: '🇧🇭', articleCount: 28, eventCount: 5, riskLevel: 'LOW', trend: 'stable', riskIndex: 28, stabilityIndex: 75 },
  { code: 'OM', name: 'عُمان', nameEn: 'Oman', region: 'gulf', flag: '🇴🇲', articleCount: 35, eventCount: 7, riskLevel: 'LOW', trend: 'stable', riskIndex: 20, stabilityIndex: 82 },
  { code: 'YE', name: 'اليمن', nameEn: 'Yemen', region: 'gulf', flag: '🇾🇪', articleCount: 89, eventCount: 78, riskLevel: 'CRITICAL', trend: 'up', riskIndex: 92, stabilityIndex: 10 },
  { code: 'LY', name: 'ليبيا', nameEn: 'Libya', region: 'northAfrica', flag: '🇱🇾', articleCount: 67, eventCount: 42, riskLevel: 'HIGH', trend: 'up', riskIndex: 75, stabilityIndex: 22 },
  { code: 'TN', name: 'تونس', nameEn: 'Tunisia', region: 'northAfrica', flag: '🇹🇳', articleCount: 41, eventCount: 18, riskLevel: 'MEDIUM', trend: 'down', riskIndex: 48, stabilityIndex: 55 },
  { code: 'DZ', name: 'الجزائر', nameEn: 'Algeria', region: 'northAfrica', flag: '🇩🇿', articleCount: 38, eventCount: 14, riskLevel: 'MEDIUM', trend: 'stable', riskIndex: 42, stabilityIndex: 58 },
  { code: 'MA', name: 'المغرب', nameEn: 'Morocco', region: 'northAfrica', flag: '🇲🇦', articleCount: 45, eventCount: 11, riskLevel: 'LOW', trend: 'up', riskIndex: 35, stabilityIndex: 70 },
  { code: 'SD', name: 'السودان', nameEn: 'Sudan', region: 'nile', flag: '🇸🇩', articleCount: 72, eventCount: 56, riskLevel: 'CRITICAL', trend: 'up', riskIndex: 85, stabilityIndex: 12 },
  { code: 'PS', name: 'فلسطين', nameEn: 'Palestine', region: 'levant', flag: '🇵🇸', articleCount: 112, eventCount: 89, riskLevel: 'CRITICAL', trend: 'up', riskIndex: 90, stabilityIndex: 8 },
];

const regions = [
  { value: 'all', label: 'جميع المناطق', labelEn: 'All Regions' },
  { value: 'gulf', label: 'الخليج العربي', labelEn: 'Arabian Gulf' },
  { value: 'levant', label: 'الشام', labelEn: 'Levant' },
  { value: 'northAfrica', label: 'شمال أفريقيا', labelEn: 'North Africa' },
  { value: 'nile', label: 'وادي النيل', labelEn: 'Nile Valley' },
];

const riskColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const riskLabels: Record<string, string> = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};

export default function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'articles' | 'risk'>('articles');

  const filteredCountries = mockCountries
    .filter((country) => {
      const matchesSearch = country.name.includes(searchQuery) || country.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
      if (sortBy === 'articles') return b.articleCount - a.articleCount;
      if (sortBy === 'risk') return b.riskIndex - a.riskIndex;
      return 0;
    });

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">الدول</h1>
          <p className="text-muted-foreground">معلومات وإحصائيات الدول العربية</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Globe className="h-3 w-3" />
            {filteredCountries.length} دولة
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث عن دولة..."
                className="ps-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="articles">الأكثر أخباراً</SelectItem>
                  <SelectItem value="risk">الأعلى مخاطر</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countries Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCountries.map((country) => (
          <Link key={country.code} href={`/${locale}/countries/${country.code}`}>
            <Card className="card-hover h-full cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <CardTitle className="text-lg">{country.name}</CardTitle>
                      <CardDescription>{country.nameEn}</CardDescription>
                    </div>
                  </div>
                  {getTrendIcon(country.trend)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">الأخبار</p>
                        <p className="font-semibold">{country.articleCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">الأحداث</p>
                        <p className="font-semibold">{country.eventCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">مؤشر المخاطر</span>
                      <span className="text-sm font-medium">{country.riskIndex}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          country.riskLevel === 'LOW' && 'bg-green-500',
                          country.riskLevel === 'MEDIUM' && 'bg-yellow-500',
                          country.riskLevel === 'HIGH' && 'bg-orange-500',
                          country.riskLevel === 'CRITICAL' && 'bg-red-500'
                        )}
                        style={{ width: `${country.riskIndex}%` }}
                      />
                    </div>
                  </div>

                  {/* Stability Index */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">مؤشر الاستقرار</span>
                      <span className="text-sm font-medium">{country.stabilityIndex}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${country.stabilityIndex}%` }}
                      />
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className="flex justify-end">
                    <Badge className={riskColors[country.riskLevel]}>
                      مخاطر {riskLabels[country.riskLevel]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCountries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد نتائج</h3>
            <p className="text-sm text-muted-foreground">جرب تغيير معايير البحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
