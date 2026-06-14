/**
 * React Query Hooks
 * يوفر hooks جاهزة لجلب البيانات الحقيقية من API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================
// Types
// ============================================

export interface Article {
  id: string;
  title: string;
  titleAr?: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
  fetchedAt: string;
  category?: string;
  riskLevel?: string;
  sentiment?: string;
  viewCount: number;
  aiProcessed: boolean;
  source?: {
    id: string;
    name: string;
    nameAr?: string;
    credibility: number;
  };
  country?: {
    id: string;
    code: string;
    name: string;
    nameAr: string;
  };
}

export interface Country {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  region?: string;
  regionAr?: string;
  capital?: string;
  capitalAr?: string;
  coordinates?: { lat: number; lng: number };
  flag?: string;
  riskIndex?: number;
  articleCount: number;
  eventCount: number;
  stats?: {
    articleCount: number;
    eventCount: number;
    recentArticles: number;
    riskDistribution: Array<{ level: string; count: number }>;
  };
}

export interface MapEvent {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  type?: string;
  severity?: string;
  status: string;
  occurredAt?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  country?: Country;
}

export interface Stats {
  articlesToday: number;
  eventsToday: number;
  alertsTriggered: number;
  aiProcessed: number;
  totalArticles: number;
  totalSources: number;
  totalCountries: number;
  comparison?: {
    articles: number;
    events: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================
// API Client
// ============================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// News / Articles Hooks
// ============================================

export interface NewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  countryId?: string;
  riskLevel?: string;
  sentiment?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useNews(filters: NewsFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => fetchAPI<Article[]>(`/api/news?${params.toString()}`),
    staleTime: 60 * 1000, // دقيقة واحدة
    refetchInterval: 5 * 60 * 1000, // إعادة الجلب كل 5 دقائق
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchAPI<Article>(`/api/news/${id}`),
    enabled: !!id,
  });
}

// ============================================
// Countries Hooks
// ============================================

export function useCountries(includeStats = false) {
  return useQuery({
    queryKey: ['countries', { includeStats }],
    queryFn: () => fetchAPI<Country[]>(`/api/countries?includeStats=${includeStats}&limit=50`),
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
}

export function useCountry(code: string) {
  return useQuery({
    queryKey: ['country', code],
    queryFn: () => fetchAPI<Country>(`/api/countries/${code}`),
    enabled: !!code,
  });
}

// ============================================
// Events Hooks (for Map)
// ============================================

export interface EventFilters {
  page?: number;
  limit?: number;
  type?: string;
  severity?: string;
  status?: string;
  countryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useEvents(filters: EventFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchAPI<MapEvent[]>(`/api/events?${params.toString()}`),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // كل دقيقتين للأحداث
  });
}

// ============================================
// Stats Hook (Dashboard)
// ============================================

export function useStats(period: '24h' | '7d' | '30d' = '7d') {
  return useQuery({
    queryKey: ['stats', period],
    queryFn: () => fetchAPI<Stats>(`/api/stats?period=${period}&includeComparison=true`),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// ============================================
// Alerts Hooks
// ============================================

export interface Alert {
  id: string;
  name: string;
  nameAr?: string;
  keywords: string[];
  countries: string[];
  frequency: string;
  channels: string[];
  isActive: boolean;
  triggerCount: number;
  lastTriggered?: string;
  createdAt: string;
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetchAPI<Alert[]>('/api/alerts'),
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Alert>) =>
      fetchAPI<Alert>('/api/alerts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

// ============================================
// Fetch News (Manual Trigger)
// ============================================

export function useFetchNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () =>
      fetchAPI<{ summary: { totalSaved: number; sources: number } }>(
        '/api/fetch-news',
        { method: 'POST' }
      ),
    onSuccess: () => {
      // إعادة جلب جميع البيانات بعد التحديث
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
}
