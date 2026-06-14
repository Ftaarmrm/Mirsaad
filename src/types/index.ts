/**
 * مِرصاد - Arab Monitor
 * الأنواع الأساسية للمشروع
 * Core TypeScript Types
 */

import { ArticleCategory, SentimentType, RiskLevel, EventType, EventSeverity, EventStatus, InsightType, AlertFrequency, SourceType, LogLevel } from '@prisma/client';

// ============================================
// Article Types - أنواع المقالات
// ============================================

export interface Article {
  id: string;
  title: string;
  titleAr?: string | null;
  content?: string | null;
  summary?: string | null;
  summaryAi?: string | null;
  url: string;
  imageUrl?: string | null;
  publishedAt?: Date | null;
  fetchedAt: Date;
  
  category?: ArticleCategory | null;
  sentiment?: SentimentType | null;
  riskLevel?: RiskLevel | null;
  
  entities?: ArticleEntities | null;
  topics?: string[] | null;
  
  sourceId?: string | null;
  source?: Source | null;
  countryId?: string | null;
  country?: Country | null;
  
  viewCount: number;
  shareCount: number;
  bookmarkCount: number;
  
  aiProcessed: boolean;
  aiProcessedAt?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleEntities {
  countries?: EntityReference[];
  people?: EntityReference[];
  organizations?: EntityReference[];
  locations?: EntityReference[];
}

export interface EntityReference {
  name: string;
  nameAr?: string;
  type: string;
  relevance?: number;
}

// ============================================
// Source Types - أنواع المصادر
// ============================================

export interface Source {
  id: string;
  name: string;
  nameAr?: string | null;
  url: string;
  feedUrl?: string | null;
  type: SourceType;
  category?: string | null;
  country?: string | null;
  language: string;
  credibility: number;
  isActive: boolean;
  lastFetched?: Date | null;
  fetchCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Country Types - أنواع الدول
// ============================================

export interface Country {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  region?: string | null;
  regionAr?: string | null;
  capital?: string | null;
  capitalAr?: string | null;
  coordinates?: Coordinates | null;
  flag?: string | null;
  population?: number | null;
  gdp?: number | null;
  
  riskIndex?: number | null;
  stabilityIndex?: number | null;
  mediaFreedomIdx?: number | null;
  
  articleCount: number;
  eventCount: number;
  lastUpdate?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// ============================================
// Event Types - أنواع الأحداث
// ============================================

export interface Event {
  id: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  
  occurredAt?: Date | null;
  location?: string | null;
  coordinates?: Coordinates | null;
  
  type?: EventType | null;
  severity?: EventSeverity | null;
  status: EventStatus;
  
  countryId?: string | null;
  country?: Country | null;
  articleId?: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Map Types - أنواع الخريطة
// ============================================

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  type: 'event' | 'article' | 'country';
  severity?: RiskLevel;
  count?: number;
  data?: Event | Article | Country;
}

export interface MapLayer {
  id: string;
  name: string;
  nameAr: string;
  type: 'markers' | 'heatmap' | 'clusters';
  visible: boolean;
  color?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewport {
  center: Coordinates;
  zoom: number;
  bounds?: MapBounds;
}

// ============================================
// Alert Types - أنواع التنبيهات
// ============================================

export interface Alert {
  id: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  
  keywords?: string[] | null;
  countries?: string[] | null;
  categories?: ArticleCategory[] | null;
  riskLevels?: RiskLevel[] | null;
  sources?: string[] | null;
  
  isActive: boolean;
  frequency: AlertFrequency;
  channels?: AlertChannel[] | null;
  
  triggerCount: number;
  lastTriggered?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertChannel {
  type: 'email' | 'webhook' | 'push' | 'sms';
  value: string;
}

// ============================================
// Insight Types - أنواع الرؤى
// ============================================

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  titleAr?: string | null;
  content: string;
  contentAr?: string | null;
  confidence?: number | null;
  
  data?: Record<string, unknown>;
  entities?: ArticleEntities;
  
  articleId?: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Timeline Types - أنواع الجدول الزمني
// ============================================

export interface TimelineItem {
  id: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  date: Date;
  type?: string | null;
  importance: number;
  
  countryId?: string | null;
  country?: Country | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Types - أنواع استجابات API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================
// Filter Types - أنواع الفلاتر
// ============================================

export interface ArticleFilters {
  search?: string;
  countries?: string[];
  categories?: ArticleCategory[];
  sources?: string[];
  riskLevels?: RiskLevel[];
  sentiments?: SentimentType[];
  dateFrom?: Date;
  dateTo?: Date;
  hasAi?: boolean;
}

export interface MapFilters {
  countries?: string[];
  types?: ('event' | 'article')[];
  categories?: ArticleCategory[];
  riskLevels?: RiskLevel[];
  dateFrom?: Date;
  dateTo?: Date;
  showEvents?: boolean;
  showArticles?: boolean;
}

// ============================================
// AI Types - أنواع الذكاء الاصطناعي
// ============================================

export interface AISummaryRequest {
  text: string;
  language?: 'ar' | 'en';
  maxLength?: number;
}

export interface AISummaryResponse {
  summary: string;
  summaryAr?: string;
  confidence: number;
  processingTime: number;
}

export interface AIAnalysisRequest {
  text: string;
  title?: string;
  language?: 'ar' | 'en';
}

export interface AIAnalysisResponse {
  summary: string;
  summaryAr?: string;
  category: ArticleCategory;
  sentiment: SentimentType;
  riskLevel: RiskLevel;
  entities: ArticleEntities;
  topics: string[];
  confidence: number;
}

export interface AIInsightRequest {
  articles: Article[];
  timeframe: 'hour' | 'day' | 'week';
  focus?: string;
}

export interface AIInsightResponse {
  insights: Insight[];
  trends: TrendItem[];
  anomalies: AnomalyItem[];
  confidence: number;
}

export interface TrendItem {
  topic: string;
  topicAr?: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  relatedArticles: string[];
}

export interface AnomalyItem {
  type: 'spike' | 'drop' | 'unusual';
  description: string;
  descriptionAr?: string;
  severity: number;
  relatedArticles: string[];
}

// ============================================
// Chart Types - أنواع الرسوم البيانية
// ============================================

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  labelAr?: string;
}

export interface CountryStat {
  country: Country;
  articleCount: number;
  eventCount: number;
  riskIndex?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CategoryStat {
  category: ArticleCategory;
  nameAr: string;
  count: number;
  percentage: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// ============================================
// Export Types - أنواع التصدير
// ============================================

export interface ExportRequest {
  format: 'pdf' | 'markdown' | 'json' | 'csv';
  content: 'articles' | 'events' | 'insights' | 'report';
  filters?: ArticleFilters;
  ids?: string[];
  options?: ExportOptions;
}

export interface ExportOptions {
  includeSummary?: boolean;
  includeAiAnalysis?: boolean;
  includeEntities?: boolean;
  language?: 'ar' | 'en' | 'both';
}

// ============================================
// Navigation Types - أنواع التنقل
// ============================================

export interface NavItem {
  id: string;
  label: string;
  labelAr: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

// ============================================
// User Preferences - تفضيلات المستخدم
// ============================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  region?: string;
  countries?: string[];
  topics?: string[];
  sources?: string[];
  dashboard?: DashboardConfig;
  notifications?: NotificationConfig;
}

export interface DashboardConfig {
  layout: DashboardWidget[];
  refreshInterval: number;
  defaultTimeRange: 'hour' | 'day' | 'week' | 'month';
}

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'map' | 'news' | 'alerts';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config?: Record<string, unknown>;
}

export interface NotificationConfig {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email?: string;
}

// ============================================
// Re-export Prisma Types
// ============================================

export type {
  ArticleCategory,
  SentimentType,
  RiskLevel,
  EventType,
  EventSeverity,
  EventStatus,
  InsightType,
  AlertFrequency,
  SourceType,
  LogLevel,
};
