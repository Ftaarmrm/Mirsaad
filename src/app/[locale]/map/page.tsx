'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { InteractiveMap } from '@/components/map/interactive-map';
import { useEvents } from '@/hooks/use-api';
import {
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Filter,
  AlertTriangle,
  Newspaper,
  MapPin,
  Expand,
  X,
  Flame,
  Shield,
  Activity,
  Clock,
  TrendingUp,
  Globe,
  Eye,
  Bookmark,
  Share2,
  ExternalLink,
  List,
  Grid,
  ChevronDown,
  Settings,
  Search,
  Zap,
  Users,
  Building2,
} from 'lucide-react';

// Types
interface MapEvent {
  id: string;
  title: string;
  country: string;
  countryCode: string;
  type: 'CONFLICT' | 'ELECTION' | 'AGREEMENT' | 'PROTEST' | 'DISASTER' | 'ANNOUNCEMENT' | 'VISIT' | 'MEETING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ONGOING' | 'RESOLVED' | 'ARCHIVED';
  publishedAt: Date;
  articleCount?: number;
  trending?: boolean;
}

// Mock events for sidebar
const mockEventsList: MapEvent[] = [
  { id: '1', title: 'تصعيد عسكري في الشمال السوري', country: 'سوريا', countryCode: 'SY', type: 'CONFLICT', severity: 'CRITICAL', status: 'ONGOING', publishedAt: new Date(Date.now() - 30 * 60 * 1000), articleCount: 89, trending: true },
  { id: '2', title: 'تصعيد في قطاع غزة', country: 'فلسطين', countryCode: 'PS', type: 'CONFLICT', severity: 'CRITICAL', status: 'ONGOING', publishedAt: new Date(Date.now() - 15 * 60 * 1000), articleCount: 156, trending: true },
  { id: '3', title: 'تصعيد الصراع في الخرطوم', country: 'السودان', countryCode: 'SD', type: 'CONFLICT', severity: 'CRITICAL', status: 'ONGOING', publishedAt: new Date(Date.now() - 45 * 60 * 1000), articleCount: 78, trending: true },
  { id: '4', title: 'اشتباكات في المنطقة الشمالية', country: 'العراق', countryCode: 'IQ', type: 'CONFLICT', severity: 'HIGH', status: 'ONGOING', publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), articleCount: 67, trending: true },
  { id: '5', title: 'هجوم على ميناء حضرموت', country: 'اليمن', countryCode: 'YE', type: 'CONFLICT', severity: 'HIGH', status: 'ONGOING', publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), articleCount: 45 },
  { id: '6', title: 'اشتباكات في طرابلس', country: 'ليبيا', countryCode: 'LY', type: 'CONFLICT', severity: 'HIGH', status: 'ONGOING', publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), articleCount: 31 },
  { id: '7', title: 'قمة خليجية طارئة', country: 'السعودية', countryCode: 'SA', type: 'MEETING', severity: 'MEDIUM', status: 'ACTIVE', publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), articleCount: 45, trending: true },
  { id: '8', title: 'مؤتمر قمة المناخ', country: 'قطر', countryCode: 'QA', type: 'MEETING', severity: 'LOW', status: 'ACTIVE', publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), articleCount: 56, trending: true },
  { id: '9', title: 'احتجاجات اقتصادية في بيروت', country: 'لبنان', countryCode: 'LB', type: 'PROTEST', severity: 'MEDIUM', status: 'ONGOING', publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), articleCount: 22 },
  { id: '10', title: 'مؤتمر اقتصادي دولي', country: 'مصر', countryCode: 'EG', type: 'MEETING', severity: 'MEDIUM', status: 'ACTIVE', publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), articleCount: 28 },
  { id: '11', title: 'زيارة رسمية من وفد أوروبي', country: 'الأردن', countryCode: 'JO', type: 'VISIT', severity: 'LOW', status: 'ACTIVE', publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), articleCount: 12 },
  { id: '12', title: 'اجتماع وزراء الخارجية', country: 'الإمارات', countryCode: 'AE', type: 'MEETING', severity: 'LOW', status: 'ACTIVE', publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), articleCount: 18 },
];

// Event type config
const eventTypeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  CONFLICT: { color: 'text-red-500', icon: <Flame className="h-4 w-4" />, label: 'صراع' },
  ELECTION: { color: 'text-purple-500', icon: <Activity className="h-4 w-4" />, label: 'انتخابات' },
  AGREEMENT: { color: 'text-green-500', icon: <Globe className="h-4 w-4" />, label: 'اتفاقية' },
  PROTEST: { color: 'text-amber-500', icon: <Users className="h-4 w-4" />, label: 'احتجاج' },
  DISASTER: { color: 'text-gray-500', icon: <AlertTriangle className="h-4 w-4" />, label: 'كارثة' },
  ANNOUNCEMENT: { color: 'text-blue-500', icon: <Newspaper className="h-4 w-4" />, label: 'إعلان' },
  VISIT: { color: 'text-cyan-500', icon: <MapPin className="h-4 w-4" />, label: 'زيارة' },
  MEETING: { color: 'text-indigo-500', icon: <Building2 className="h-4 w-4" />, label: 'اجتماع' },
  OTHER: { color: 'text-slate-500', icon: <MapPin className="h-4 w-4" />, label: 'أخرى' },
};

// Severity config
const severityConfig: Record<string, { bgColor: string; borderColor: string; label: string }> = {
  LOW: { bgColor: 'bg-green-100 dark:bg-green-900/30', borderColor: 'border-green-500', label: 'منخفض' },
  MEDIUM: { bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', borderColor: 'border-yellow-500', label: 'متوسط' },
  HIGH: { bgColor: 'bg-orange-100 dark:bg-orange-900/30', borderColor: 'border-orange-500', label: 'عالي' },
  CRITICAL: { bgColor: 'bg-red-100 dark:bg-red-900/30', borderColor: 'border-red-500', label: 'حرج' },
};

// Country codes and names
const countries = [
  { code: 'all', name: 'جميع الدول' },
  { code: 'SA', name: 'السعودية' },
  { code: 'AE', name: 'الإمارات' },
  { code: 'EG', name: 'مصر' },
  { code: 'IQ', name: 'العراق' },
  { code: 'SY', name: 'سوريا' },
  { code: 'PS', name: 'فلسطين' },
  { code: 'YE', name: 'اليمن' },
  { code: 'LY', name: 'ليبيا' },
  { code: 'SD', name: 'السودان' },
  { code: 'JO', name: 'الأردن' },
  { code: 'LB', name: 'لبنان' },
  { code: 'QA', name: 'قطر' },
  { code: 'KW', name: 'الكويت' },
  { code: 'BH', name: 'البحرين' },
  { code: 'OM', name: 'عُمان' },
];

export default function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = React.use(params);
  const [selectedEvent, setSelectedEvent] = React.useState<MapEvent | null>(null);
  const [viewMode, setViewMode] = React.useState<'split' | 'map' | 'list'>('split');
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedSeverity, setSelectedSeverity] = React.useState('all');
  const [selectedCountry, setSelectedCountry] = React.useState('all');
  const [showTrendingOnly, setShowTrendingOnly] = React.useState(false);
  
  // Map layers
  const [showHeatmap, setShowHeatmap] = React.useState(false);
  const [showClusters, setShowClusters] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [mapStyle, setMapStyle] = React.useState<'streets' | 'dark' | 'satellite'>('streets');
  
  // جلب الأحداث الحقيقية من API
  const { data: eventsResponse, isLoading: eventsLoading } = useEvents({ limit: 100 });
  
  // تحويل البيانات لتتوافق مع MapEvent
  const liveEvents: MapEvent[] = React.useMemo(() => {
    const apiEvents = eventsResponse?.data || [];
    return apiEvents
      .filter((e: any) => e.coordinates && e.country)
      .map((e: any) => ({
        id: e.id,
        title: e.titleAr || e.title,
        country: e.country?.nameAr || e.country?.name || '',
        countryCode: e.country?.code || '',
        type: e.type || 'OTHER',
        severity: e.severity || 'LOW',
        status: e.status || 'ACTIVE',
        publishedAt: new Date(e.occurredAt || e.createdAt || Date.now()),
        articleCount: e.articleCount || 0,
        trending: e.severity === 'CRITICAL' || e.severity === 'HIGH',
      }));
  }, [eventsResponse]);
  
  // استخدم البيانات الحقيقية إذا توفرت، وإلا fallback للوهمية
  const eventsSource = liveEvents.length > 0 ? liveEvents : mockEventsList;
  
  // Filter events
  const filteredEvents = React.useMemo(() => {
    return eventsSource.filter(event => {
      if (searchQuery && !event.title.includes(searchQuery)) return false;
      if (selectedType !== 'all' && event.type !== selectedType) return false;
      if (selectedSeverity !== 'all' && event.severity !== selectedSeverity) return false;
      if (selectedCountry !== 'all' && event.countryCode !== selectedCountry) return false;
      if (showTrendingOnly && !event.trending) return false;
      return true;
    });
  }, [eventsSource, searchQuery, selectedType, selectedSeverity, selectedCountry, showTrendingOnly]);
  
  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${Math.floor(diffHours / 24)} يوم`;
  };
  
  const stats = {
    total: filteredEvents.length,
    critical: filteredEvents.filter(e => e.severity === 'CRITICAL').length,
    active: filteredEvents.filter(e => e.status === 'ACTIVE' || e.status === 'ONGOING').length,
    countries: new Set(filteredEvents.map(e => e.countryCode)).size,
  };
  
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">الخريطة التفاعلية</h1>
          <p className="text-muted-foreground">تتبع الأحداث والأخبار في الوقت الحقيقي</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            مباشر
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            {filteredEvents.length} حدث
          </Badge>
          
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border">
            <Button
              variant={viewMode === 'split' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('split')}
              className="rounded-e-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('map')}
              className="rounded-none border-x"
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-s-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters Bar */}
      <Card className="shrink-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="بحث..."
                  className="ps-9 w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="CONFLICT">صراع</SelectItem>
                  <SelectItem value="PROTEST">احتجاج</SelectItem>
                  <SelectItem value="MEETING">اجتماع</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                  <SelectItem value="VISIT">زيارة</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Severity Filter */}
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="الخطورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="CRITICAL">حرج</SelectItem>
                  <SelectItem value="HIGH">عالي</SelectItem>
                  <SelectItem value="MEDIUM">متوسط</SelectItem>
                  <SelectItem value="LOW">منخفض</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Country Filter */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Trending Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="trending"
                  checked={showTrendingOnly}
                  onCheckedChange={setShowTrendingOnly}
                />
                <Label htmlFor="trending" className="text-sm cursor-pointer">
                  <Zap className="h-4 w-4 inline ms-1 text-amber-500" />
                  الأكثر تداولاً
                </Label>
              </div>
              
              {/* Layers Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Layers className="h-4 w-4" />
                    الطبقات
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>إعدادات الخريطة</SheetTitle>
                    <SheetDescription>تخصيص عرض الخريطة</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Map Style */}
                    <div className="space-y-3">
                      <Label>نمط الخريطة</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={mapStyle === 'streets' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMapStyle('streets')}
                        >
                          عادي
                        </Button>
                        <Button
                          variant={mapStyle === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMapStyle('dark')}
                        >
                          داكن
                        </Button>
                        <Button
                          variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMapStyle('satellite')}
                        >
                          قمر صناعي
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Layers */}
                    <div className="space-y-4">
                      <Label>الطبقات</Label>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">تجميع العلامات</p>
                          <p className="text-xs text-muted-foreground">تجميع الأحداث القريبة</p>
                        </div>
                        <Switch checked={showClusters} onCheckedChange={setShowClusters} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">الخريطة الحرارية</p>
                          <p className="text-xs text-muted-foreground">عرض كثافة الأحداث</p>
                        </div>
                        <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">التسميات</p>
                          <p className="text-xs text-muted-foreground">أسماء المدن والدول</p>
                        </div>
                        <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="flex-1 grid gap-4 min-h-0" style={{ 
        gridTemplateColumns: viewMode === 'split' ? '1fr 320px' : '1fr' 
      }}>
        {/* Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <Card className="overflow-hidden min-h-[400px]">
            <InteractiveMap 
              locale={locale} 
              className="h-full"
              onEventSelect={setSelectedEvent}
              events={eventsSource as any}
            />
          </Card>
        )}
        
        {/* Events List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <Card className="flex flex-col min-h-0">
            <CardHeader className="pb-2 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  الأحداث ({filteredEvents.length})
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    {stats.critical} حرج
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4 pt-0 space-y-2">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all',
                        'hover:bg-muted/50 hover:shadow-sm',
                        selectedEvent?.id === event.id && 'bg-primary/10 border-primary',
                        severityConfig[event.severity].bgColor,
                        severityConfig[event.severity].borderColor,
                        'border-s-4'
                      )}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={eventTypeConfig[event.type].color}>
                              {eventTypeConfig[event.type].icon}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {eventTypeConfig[event.type].label}
                            </Badge>
                            {event.trending && (
                              <Zap className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{event.country}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(event.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs',
                              event.severity === 'CRITICAL' && 'border-red-500 text-red-600',
                              event.severity === 'HIGH' && 'border-orange-500 text-orange-600'
                            )}
                          >
                            {severityConfig[event.severity].label}
                          </Badge>
                          {event.articleCount && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Newspaper className="h-3 w-3" />
                              {event.articleCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد أحداث تطابق الفلاتر</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedType('all');
                          setSelectedSeverity('all');
                          setSelectedCountry('all');
                          setShowTrendingOnly(false);
                        }}
                      >
                        إعادة ضبط الفلاتر
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
