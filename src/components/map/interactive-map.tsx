'use client';

import * as React from 'react';
import maplibregl, { Map as MapLibreMap, Marker, LngLatLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
} from '@/components/ui/sheet';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Filter,
  AlertTriangle,
  Newspaper,
  Navigation,
  Activity,
  Flame,
  Shield,
  Users,
  Building2,
  Globe,
  Clock,
  Eye,
  Bookmark,
  Share2,
  ExternalLink,
  X,
} from 'lucide-react';

// Types
interface MapEvent {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  country: string;
  countryCode: string;
  coordinates: [number, number];
  type: 'CONFLICT' | 'ELECTION' | 'AGREEMENT' | 'PROTEST' | 'DISASTER' | 'ANNOUNCEMENT' | 'VISIT' | 'MEETING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ONGOING' | 'RESOLVED' | 'ARCHIVED';
  source?: string;
  sourceUrl?: string;
  publishedAt: Date;
  articleCount?: number;
  trending?: boolean;
}

// Mock events data
const mockEvents: MapEvent[] = [
  // Saudi Arabia
  {
    id: 'sa-1',
    title: 'قمة خليجية طارئة لمناقشة التطورات الإقليمية',
    country: 'السعودية',
    countryCode: 'SA',
    coordinates: [46.6753, 24.7136],
    type: 'MEETING',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    articleCount: 45,
    trending: true,
  },
  {
    id: 'sa-2',
    title: 'افتتاح مشروع نيوم الجديد',
    country: 'السعودية',
    countryCode: 'SA',
    coordinates: [37.5, 28.5],
    type: 'ANNOUNCEMENT',
    severity: 'LOW',
    status: 'ACTIVE',
    source: 'العربية',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    articleCount: 23,
  },
  // UAE
  {
    id: 'ae-1',
    title: 'اجتماع وزراء الخارجية الخليجيين',
    country: 'الإمارات',
    countryCode: 'AE',
    coordinates: [54.3773, 24.4539],
    type: 'MEETING',
    severity: 'LOW',
    status: 'ACTIVE',
    source: 'الخليج',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    articleCount: 18,
  },
  // Egypt
  {
    id: 'eg-1',
    title: 'مؤتمر اقتصادي دولي في القاهرة',
    country: 'مصر',
    countryCode: 'EG',
    coordinates: [31.2357, 30.0444],
    type: 'MEETING',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    source: 'الأهرام',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    articleCount: 28,
  },
  // Iraq
  {
    id: 'iq-1',
    title: 'اشتباكات في المنطقة الشمالية',
    country: 'العراق',
    countryCode: 'IQ',
    coordinates: [44.3661, 33.3152],
    type: 'CONFLICT',
    severity: 'HIGH',
    status: 'ONGOING',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    articleCount: 67,
    trending: true,
  },
  // Syria
  {
    id: 'sy-1',
    title: 'تصعيد عسكري في الشمال السوري',
    country: 'سوريا',
    countryCode: 'SY',
    coordinates: [37.0, 36.0],
    type: 'CONFLICT',
    severity: 'CRITICAL',
    status: 'ONGOING',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 30 * 60 * 1000),
    articleCount: 89,
    trending: true,
  },
  // Palestine
  {
    id: 'ps-1',
    title: 'تصعيد في قطاع غزة',
    country: 'فلسطين',
    countryCode: 'PS',
    coordinates: [34.0, 31.5],
    type: 'CONFLICT',
    severity: 'CRITICAL',
    status: 'ONGOING',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 15 * 60 * 1000),
    articleCount: 156,
    trending: true,
  },
  // Yemen
  {
    id: 'ye-1',
    title: 'هجوم على ميناء حضرموت',
    country: 'اليمن',
    countryCode: 'YE',
    coordinates: [48.5, 15.5],
    type: 'CONFLICT',
    severity: 'HIGH',
    status: 'ONGOING',
    source: 'العربية',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    articleCount: 45,
  },
  // Lebanon
  {
    id: 'lb-1',
    title: 'احتجاجات اقتصادية في بيروت',
    country: 'لبنان',
    countryCode: 'LB',
    coordinates: [35.5, 33.9],
    type: 'PROTEST',
    severity: 'MEDIUM',
    status: 'ONGOING',
    source: 'النهار',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    articleCount: 22,
  },
  // Jordan
  {
    id: 'jo-1',
    title: 'زيارة رسمية من وفد أوروبي',
    country: 'الأردن',
    countryCode: 'JO',
    coordinates: [35.9284, 31.9454],
    type: 'VISIT',
    severity: 'LOW',
    status: 'ACTIVE',
    source: 'الرأي',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    articleCount: 12,
  },
  // Qatar
  {
    id: 'qa-1',
    title: 'مؤتمر قمة المناخ',
    country: 'قطر',
    countryCode: 'QA',
    coordinates: [51.5310, 25.2854],
    type: 'MEETING',
    severity: 'LOW',
    status: 'ACTIVE',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    articleCount: 56,
    trending: true,
  },
  // Libya
  {
    id: 'ly-1',
    title: 'اشتباكات في طرابلس',
    country: 'ليبيا',
    countryCode: 'LY',
    coordinates: [13.2, 32.9],
    type: 'CONFLICT',
    severity: 'HIGH',
    status: 'ONGOING',
    source: 'العربية',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    articleCount: 31,
  },
  // Sudan
  {
    id: 'sd-1',
    title: 'تصعيد الصراع في الخرطوم',
    country: 'السودان',
    countryCode: 'SD',
    coordinates: [32.5, 15.5],
    type: 'CONFLICT',
    severity: 'CRITICAL',
    status: 'ONGOING',
    source: 'الجزيرة',
    publishedAt: new Date(Date.now() - 45 * 60 * 1000),
    articleCount: 78,
    trending: true,
  },
];

// Event type styling
const eventTypeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  CONFLICT: { color: '#ef4444', icon: <Flame className="h-4 w-4" />, label: 'صراع' },
  ELECTION: { color: '#8b5cf6', icon: <Activity className="h-4 w-4" />, label: 'انتخابات' },
  AGREEMENT: { color: '#10b981', icon: <Globe className="h-4 w-4" />, label: 'اتفاقية' },
  PROTEST: { color: '#f59e0b', icon: <Users className="h-4 w-4" />, label: 'احتجاج' },
  DISASTER: { color: '#6b7280', icon: <AlertTriangle className="h-4 w-4" />, label: 'كارثة' },
  ANNOUNCEMENT: { color: '#3b82f6', icon: <Newspaper className="h-4 w-4" />, label: 'إعلان' },
  VISIT: { color: '#06b6d4', icon: <Navigation className="h-4 w-4" />, label: 'زيارة' },
  MEETING: { color: '#6366f1', icon: <Building2 className="h-4 w-4" />, label: 'اجتماع' },
  OTHER: { color: '#9ca3af', icon: <MapPin className="h-4 w-4" />, label: 'أخرى' },
};

// Severity styling
const severityConfig: Record<string, { color: string; bgColor: string; borderColor: string; label: string }> = {
  LOW: { color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-500', label: 'منخفض' },
  MEDIUM: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500', label: 'متوسط' },
  HIGH: { color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-500', label: 'عالي' },
  CRITICAL: { color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-500', label: 'حرج' },
};

// Create custom marker element
function createMarkerElement(event: MapEvent, isSelected: boolean = false): HTMLDivElement {
  const el = document.createElement('div');
  const config = eventTypeConfig[event.type];
  
  el.className = cn(
    'flex items-center justify-center rounded-full cursor-pointer transition-all duration-200',
    'shadow-lg hover:scale-125',
    isSelected && 'ring-4 ring-primary ring-offset-2 scale-125',
    event.severity === 'CRITICAL' && 'animate-pulse'
  );
  
  const size = event.articleCount && event.articleCount > 50 ? 36 : 
               event.articleCount && event.articleCount > 20 ? 28 : 20;
  
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.backgroundColor = config.color;
  el.style.border = `3px solid ${event.severity === 'CRITICAL' ? '#7f1d1d' : 
                                 event.severity === 'HIGH' ? '#9a3412' : 
                                 event.severity === 'MEDIUM' ? '#a16207' : '#166534'}`;
  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  
  return el;
}

// Map component props
interface InteractiveMapProps {
  locale: string;
  className?: string;
  onEventSelect?: (event: MapEvent | null) => void;
  events?: MapEvent[];
}

export function InteractiveMap({ locale, className, onEventSelect, events: eventsProp }: InteractiveMapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<MapLibreMap | null>(null);
  const markersRef = React.useRef<Marker[]>([]);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<MapEvent | null>(null);
  
  // استخدم البيانات الممررة، وإلا استخدم mockEvents كـ fallback
  const sourceEvents = eventsProp && eventsProp.length > 0 ? eventsProp : mockEvents;
  
  const [filteredEvents, setFilteredEvents] = React.useState<MapEvent[]>(sourceEvents);
  const [hoveredEvent, setHoveredEvent] = React.useState<MapEvent | null>(null);
  
  // Filters
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>('all');
  const [currentZoom, setCurrentZoom] = React.useState(4);
  
  // Initialize map
  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap',
            },
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        },
        center: [35, 28],
        zoom: 4,
        minZoom: 2,
        maxZoom: 12,
        pitchWithRotate: false,
        dragRotate: false,
      });

      map.current.on('load', () => setMapLoaded(true));
      map.current.on('zoom', () => {
        if (map.current) setCurrentZoom(map.current.getZoom());
      });

      // Add scale control
      map.current.addControl(
        new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }),
        'bottom-right'
      );
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapLoaded(true); // Allow fallback UI
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update markers
  React.useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    const filtered = sourceEvents.filter(event => {
      if (selectedType !== 'all' && event.type !== selectedType) return false;
      if (selectedSeverity !== 'all' && event.severity !== selectedSeverity) return false;
      return true;
    });
    
    setFilteredEvents(filtered);
    
    filtered.forEach(event => {
      const el = createMarkerElement(event, selectedEvent?.id === event.id);
      
      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat(event.coordinates)
        .addTo(map.current!);
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedEvent(event);
        onEventSelect?.(event);
        map.current?.flyTo({
          center: event.coordinates,
          zoom: 7,
          duration: 1500,
        });
      });
      
      el.addEventListener('mouseenter', () => setHoveredEvent(event));
      el.addEventListener('mouseleave', () => setHoveredEvent(null));
      
      markersRef.current.push(marker);
    });
  }, [mapLoaded, selectedType, selectedSeverity, selectedEvent, onEventSelect, sourceEvents]);
  
  // Control functions
  const handleZoomIn = () => map.current?.zoomIn({ duration: 500 });
  const handleZoomOut = () => map.current?.zoomOut({ duration: 500 });
  const handleResetView = () => {
    map.current?.flyTo({ center: [35, 28], zoom: 4, duration: 1500 });
    setSelectedEvent(null);
    onEventSelect?.(null);
  };
  const handleFullscreen = () => {
    if (mapContainer.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else mapContainer.current.requestFullscreen();
    }
  };
  
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
    <div className={cn('relative h-full w-full', className)}>
      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />
      
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-muted-foreground">جارٍ تحميل الخريطة...</p>
          </div>
        </div>
      )}
      
      {/* Zoom Controls */}
      <div className="absolute top-4 start-4 z-20 flex flex-col gap-2">
        <Card className="p-1">
          <div className="flex flex-col">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator />
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        
        <Card className="p-1">
          <div className="flex flex-col">
            <Button variant="ghost" size="icon" onClick={handleResetView} className="h-8 w-8" title="إعادة ضبط">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Separator />
            <Button variant="ghost" size="icon" onClick={handleFullscreen} className="h-8 w-8" title="ملء الشاشة">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Stats */}
      <Card className="absolute top-4 end-4 z-20 p-3">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-primary">{stats.total}</p>
            <p className="text-xs text-muted-foreground">حدث</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-500">{stats.critical}</p>
            <p className="text-xs text-muted-foreground">حرج</p>
          </div>
          <div>
            <p className="text-xl font-bold text-orange-500">{stats.active}</p>
            <p className="text-xs text-muted-foreground">نشط</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-500">{stats.countries}</p>
            <p className="text-xs text-muted-foreground">دولة</p>
          </div>
        </div>
      </Card>
      
      {/* Legend */}
      <Card className="absolute bottom-4 start-4 z-20 p-3">
        <p className="text-xs font-medium mb-2">دليل الألوان</p>
        <div className="space-y-1">
          {Object.entries(eventTypeConfig).slice(0, 5).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span>{config.label}</span>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Event Details Sheet */}
      <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEvent && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${eventTypeConfig[selectedEvent.type].color}20` }}
                  >
                    <div style={{ color: eventTypeConfig[selectedEvent.type].color }}>
                      {eventTypeConfig[selectedEvent.type].icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-start text-lg">{selectedEvent.title}</SheetTitle>
                    <SheetDescription className="text-start">{selectedEvent.country}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={cn(severityConfig[selectedEvent.severity].color, severityConfig[selectedEvent.severity].bgColor)}>
                    خطورة: {severityConfig[selectedEvent.severity].label}
                  </Badge>
                  <Badge variant="outline">
                    {selectedEvent.status === 'ACTIVE' ? 'نشط' : selectedEvent.status === 'ONGOING' ? 'مستمر' : 'انتهى'}
                  </Badge>
                  <Badge variant="secondary">{eventTypeConfig[selectedEvent.type].label}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">الموقع</span>
                    </div>
                    <p className="text-sm font-medium mt-1">
                      {selectedEvent.coordinates[1].toFixed(4)}, {selectedEvent.coordinates[0].toFixed(4)}
                    </p>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">الوقت</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{formatTimeAgo(selectedEvent.publishedAt)}</p>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Newspaper className="h-4 w-4" />
                      <span className="text-xs">المقالات</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{selectedEvent.articleCount || 0}</p>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">المصدر</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{selectedEvent.source || 'غير محدد'}</p>
                  </Card>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Bookmark className="h-4 w-4" /> حفظ
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" /> مشاركة
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Hover Tooltip */}
      {hoveredEvent && !selectedEvent && (
        <Card className="absolute bottom-4 end-4 z-30 p-4 max-w-xs shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" style={{ borderColor: eventTypeConfig[hoveredEvent.type].color, color: eventTypeConfig[hoveredEvent.type].color }}>
                {eventTypeConfig[hoveredEvent.type].label}
              </Badge>
              <span className="text-xs text-muted-foreground">{hoveredEvent.country}</span>
            </div>
            <p className="font-medium text-sm">{hoveredEvent.title}</p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(hoveredEvent.publishedAt)}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
