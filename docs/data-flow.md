# 🔄 تدفق البيانات

## 📋 نظرة عامة

يوضح هذا المستند كيفية تدفق البيانات في منصة مِرصاد، من جمع الأخبار إلى عرضها للمستخدم.

---

## 🌊 المسار العام للبيانات

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  المصادر     │ ──▶ │  التجميع     │ ──▶ │  المعالجة    │
│  الخارجية    │     │  والتنقية    │     │  والتصنيف    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  العرض       │ ◀── │  التخزين     │ ◀── │  التحليل     │
│  للمستخدم    │     │  والفهرسة    │     │  الذكي       │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 📰 1. خط أنابيب جمع الأخبار

### المراحل

```
RSS/API Sources → Normalizer → Deduplication → Classification → Storage → AI Analysis
```

### 1️⃣ التجميع (Collection)

```typescript
// جدول التجميع
interface FetchJob {
  sourceId: string;
  source: Source;
  lastFetched: Date;
  interval: number; // بالدقائق
}

// عملية التجميع
async function fetchFromSource(source: Source): Promise<RawArticle[]> {
  switch (source.type) {
    case 'RSS':
      return await fetchRSSFeed(source.feedUrl);
    case 'API':
      return await fetchFromAPI(source.url, source.apiKey);
    case 'WEBHOOK':
      return await getWebhookArticles(source.id);
    default:
      return [];
  }
}
```

### 2️⃣ التطبيع (Normalization)

```typescript
interface NormalizedArticle {
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  sourceId: string;
  language: string;
}

function normalizeArticle(raw: RawArticle, source: Source): NormalizedArticle {
  return {
    title: cleanText(raw.title),
    content: extractContent(raw),
    url: raw.link || raw.url,
    imageUrl: extractImage(raw),
    publishedAt: parseDate(raw.pubDate),
    sourceId: source.id,
    language: source.language || 'ar',
  };
}
```

### 3️⃣ إزالة التكرار (Deduplication)

```typescript
async function deduplicateArticles(articles: NormalizedArticle[]): Promise<NormalizedArticle[]> {
  const unique: NormalizedArticle[] = [];
  
  for (const article of articles) {
    // التحقق من URL
    const existsByUrl = await db.article.findUnique({
      where: { url: article.url }
    });
    
    if (existsByUrl) continue;
    
    // التحقق من التشابه في العنوان
    const similarTitle = await db.article.findFirst({
      where: {
        title: { contains: article.title.substring(0, 50) }
      }
    });
    
    if (!similarTitle) {
      unique.push(article);
    }
  }
  
  return unique;
}
```

---

## 🤖 2. خط أنابيب الذكاء الاصطناعي

### المراحل

```
Article Text → Preprocessing → LLM Analysis → Structured Output
                                           ↓
                                    ┌──────────────────┐
                                    │ Summary (Arabic) │
                                    │ Entities         │
                                    │ Sentiment        │
                                    │ Category         │
                                    │ Risk Level       │
                                    └──────────────────┘
```

### 1️⃣ المعالجة المسبقة

```typescript
function preprocessText(text: string): string {
  return text
    .replace(/\s+/g, ' ')           // إزالة المسافات الزائدة
    .replace(/<[^>]*>/g, '')        // إزالة HTML
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?]/g, '') // تنظيف
    .trim()
    .substring(0, 4000);            // تحديد الطول
}
```

### 2️⃣ التحليل بالذكاء الاصطناعي

```typescript
interface AIAnalysisResult {
  summaryAr: string;
  entities: {
    countries: string[];
    people: string[];
    organizations: string[];
  };
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  category: ArticleCategory;
  riskLevel: RiskLevel;
  confidence: number;
}

async function analyzeWithAI(article: Article): Promise<AIAnalysisResult> {
  const prompt = `
    قم بتحليل هذا المقال العربي:
    
    العنوان: ${article.title}
    المحتوى: ${article.content}
    
    أعد النتيجة بصيغة JSON تحتوي على:
    - ملخص بالعربية (3-4 جمل)
    - الكيانات المستخرجة
    - الشعور العام
    - التصنيف
    - مستوى الخطورة
  `;
  
  const response = await ai.chat({
    messages: [{ role: 'user', content: prompt }],
    responseFormat: 'json',
  });
  
  return JSON.parse(response.content);
}
```

### 3️⃣ تخزين النتائج

```typescript
async function saveAnalysis(articleId: string, analysis: AIAnalysisResult) {
  await db.article.update({
    where: { id: articleId },
    data: {
      summaryAi: analysis.summaryAr,
      entities: analysis.entities,
      sentiment: analysis.sentiment,
      category: analysis.category,
      riskLevel: analysis.riskLevel,
      aiProcessed: true,
      aiProcessedAt: new Date(),
    },
  });
  
  // إنشاء Insight
  await db.insight.create({
    data: {
      type: 'SUMMARY',
      title: 'ملخص الذكاء الاصطناعي',
      titleAr: analysis.summaryAr,
      content: analysis.summaryAr,
      confidence: analysis.confidence,
      articleId: articleId,
    },
  });
}
```

---

## 🗺️ 3. تدفق الخريطة التفاعلية

### بناء بيانات الخريطة

```typescript
interface MapMarker {
  id: string;
  type: 'event' | 'article';
  coordinates: [number, number]; // [lng, lat]
  title: string;
  description?: string;
  severity?: EventSeverity;
  riskLevel?: RiskLevel;
  count: number;
}

async function getMapData(filters: MapFilters): Promise<MapMarker[]> {
  const markers: MapMarker[] = [];
  
  // جلب الأحداث
  if (filters.showEvents) {
    const events = await db.event.findMany({
      where: {
        occurredAt: { gte: filters.startDate, lte: filters.endDate },
        type: filters.eventTypes ? { in: filters.eventTypes } : undefined,
      },
      include: { country: true },
    });
    
    for (const event of events) {
      if (event.coordinates) {
        markers.push({
          id: event.id,
          type: 'event',
          coordinates: event.coordinates as [number, number],
          title: event.titleAr || event.title,
          description: event.descriptionAr || event.description,
          severity: event.severity,
          count: 1,
        });
      }
    }
  }
  
  // جلب الأخبار حسب الدولة
  if (filters.showArticles) {
    const countries = await db.country.findMany({
      include: {
        _count: { select: { articles: {
          where: {
            publishedAt: { gte: filters.startDate }
          }
        }}},
      },
    });
    
    for (const country of countries) {
      if (country.coordinates) {
        markers.push({
          id: country.id,
          type: 'article',
          coordinates: country.coordinates as [number, number],
          title: country.nameAr,
          count: country._count.articles,
          riskLevel: country.riskIndex > 70 ? 'HIGH' : 
                     country.riskIndex > 40 ? 'MEDIUM' : 'LOW',
        });
      }
    }
  }
  
  return markers;
}
```

---

## 🔔 4. تدفق التنبيهات

### تفعيل التنبيهات

```
New Article → Match Alerts → Trigger Actions → Notify Users
```

```typescript
async function checkAlerts(article: Article) {
  // جلب التنبيهات النشطة
  const alerts = await db.alert.findMany({
    where: { isActive: true },
  });
  
  for (const alert of alerts) {
    const matches = await matchAlert(article, alert);
    
    if (matches) {
      await triggerAlert(alert, article);
    }
  }
}

async function matchAlert(article: Article, alert: Alert): Promise<boolean> {
  // التحقق من الكلمات المفتاحية
  if (alert.keywords) {
    const keywords = alert.keywords as string[];
    const text = `${article.title} ${article.content}`;
    const hasKeyword = keywords.some(kw => 
      text.toLowerCase().includes(kw.toLowerCase())
    );
    if (!hasKeyword) return false;
  }
  
  // التحقق من الدول
  if (alert.countries) {
    const countries = alert.countries as string[];
    if (article.countryId && !countries.includes(article.countryId)) {
      return false;
    }
  }
  
  // التحقق من مستوى الخطورة
  if (alert.riskLevels) {
    const riskLevels = alert.riskLevels as RiskLevel[];
    if (article.riskLevel && !riskLevels.includes(article.riskLevel)) {
      return false;
    }
  }
  
  return true;
}

async function triggerAlert(alert: Alert, article: Article) {
  // تحديث عداد التنبيه
  await db.alert.update({
    where: { id: alert.id },
    data: {
      triggerCount: { increment: 1 },
      lastTriggered: new Date(),
    },
  });
  
  // إرسال الإشعارات
  const channels = alert.channels as NotificationChannel[];
  
  for (const channel of channels) {
    switch (channel.type) {
      case 'webhook':
        await sendWebhook(channel.url, { alert, article });
        break;
      case 'email':
        await sendEmail(channel.address, { alert, article });
        break;
      case 'push':
        await sendPushNotification(channel.userId, { alert, article });
        break;
    }
  }
}
```

---

## 📊 5. تدفق التحليلات

### التجميع اليومي

```typescript
async function generateDailyStats(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // إحصائيات المقالات
  const articlesCount = await db.article.count({
    where: {
      publishedAt: { gte: startOfDay, lte: endOfDay }
    }
  });
  
  // إحصائيات الأحداث
  const eventsCount = await db.event.count({
    where: {
      occurredAt: { gte: startOfDay, lte: endOfDay }
    }
  });
  
  // أعلى الدول ذكراً
  const topCountries = await db.country.findMany({
    include: {
      _count: { select: { articles: {
        where: { publishedAt: { gte: startOfDay } }
      }}}
    },
    orderBy: { articleCount: 'desc' },
    take: 10,
  });
  
  // أعلى المواضيع
  const topTopics = await getTopTopics(startOfDay, endOfDay);
  
  // حفظ الإحصائيات
  await db.dailyStat.upsert({
    where: { date: startOfDay },
    create: {
      date: startOfDay,
      articlesCount,
      eventsCount,
      topCountries,
      topTopics,
    },
    update: {
      articlesCount,
      eventsCount,
      topCountries,
      topTopics,
    },
  });
}
```

### التحليلات الذكية

```typescript
async function generateInsights(params: InsightParams) {
  // جلب البيانات
  const articles = await db.article.findMany({
    where: {
      publishedAt: { gte: params.startDate, lte: params.endDate },
      countryId: params.countryId,
    },
    include: { country: true },
  });
  
  // إرسال للذكاء الاصطناعي
  const prompt = `
    حلل هذه المجموعة من الأخبار (${articles.length} خبر):
    
    ${articles.slice(0, 20).map(a => `- ${a.title}`).join('\n')}
    
    قدم:
    1. ملخص تنفيذي
    2. الاتجاهات الرئيسية
    3. أي أنماط غير عادية
    4. توصيات
  `;
  
  const insights = await ai.analyze(prompt);
  
  return insights;
}
```

---

## 🔌 6. تدفق API

### طلب HTTP نموذجي

```
Client Request → API Route → Service Layer → Database → Response
     │              │              │              │           │
     │              │              │              │           │
     └── Authentication ──────────┘              │           │
                    │                            │           │
                    └── Validation ──────────────┘           │
                                 │                           │
                                 └── Caching ────────────────┘
```

### مثال: جلب الأخبار

```typescript
// GET /api/news?country=SA&category=ECONOMY&limit=20

export async function GET(request: Request) {
  // 1. تحليل المعاملات
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const category = searchParams.get('category') as ArticleCategory;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // 2. التحقق من الصحة
  if (limit > 100) {
    return Response.json(
      { error: 'Limit cannot exceed 100' },
      { status: 400 }
    );
  }
  
  // 3. بناء الاستعلام
  const where = {
    ...(country && { countryId: country }),
    ...(category && { category }),
  };
  
  // 4. جلب البيانات
  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        source: { select: { name: true, nameAr: true } },
        country: { select: { nameAr: true, flag: true } },
      },
    }),
    db.article.count({ where }),
  ]);
  
  // 5. إرجاع الاستجابة
  return Response.json({
    data: articles,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}
```

---

## ⚡ 7. التخزين المؤقت (Caching)

### استراتيجية التخزين

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Client     │ ──▶ │  React      │ ──▶ │  Database   │
│  Browser    │     │  Query      │     │  SQLite     │
│  Cache      │     │  Cache      │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### React Query Setup

```typescript
// إعداد الاستعلام
const { data, isLoading, error } = useQuery({
  queryKey: ['articles', country, category],
  queryFn: () => fetchArticles(country, category),
  staleTime: 5 * 60 * 1000, // 5 دقائق
  gcTime: 30 * 60 * 1000,   // 30 دقيقة
  refetchInterval: 60 * 1000, // تحديث كل دقيقة
});

// إعداد الطفرات
const mutation = useMutation({
  mutationFn: createAlert,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  },
});
```

---

## 📈 8. مراقبة الأداء

### المقاييس الرئيسية

```typescript
interface PerformanceMetrics {
  // التجميع
  fetchTime: number;          // وقت جلب الأخبار
  articlesPerFetch: number;   // مقالات لكل جلب
  
  // المعالجة
  processingTime: number;     // وقت المعالجة
  aiProcessingTime: number;   // وقت تحليل AI
  
  // العرض
  pageLoadTime: number;       // وقت تحميل الصفحة
  apiResponseTime: number;    // وقت استجابة API
  
  // النظام
  dbQueryTime: number;        // وقت استعلام DB
  cacheHitRate: number;       // معدل إصابة الكاش
}
```

---

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

| المشكلة | السبب | الحل |
|---------|-------|------|
| بطء التحميل | كاش غير مفعّل | تفعيل React Query Cache |
| أخبار مكررة | فشل إزالة التكرار | تحسين خوارزمية التشابه |
| فشل AI | نفاد الحصة | تقليل معدل الطلبات |
| أخطاء DB | استعلامات بطيئة | إضافة فهرس |

---

*آخر تحديث: 2024*
