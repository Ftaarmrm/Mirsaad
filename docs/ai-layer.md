# 🤖 طبقة الذكاء الاصطناعي

## 📋 نظرة عامة

تستخدم منصة مِرصاد الذكاء الاصطناعي لتقديم تحليلات ذكية باللغة العربية، تشمل التلخيص، استخراج الكيانات، تحليل الشعور العام، وتحديد مستوى المخاطر.

---

## 🧠 القدرات الذكية

| القدرة | الوصف | الاستخدام |
|--------|-------|-----------|
| **التلخيص** | إنشاء ملخص موجز بالعربية | عرض سريع للمحتوى |
| **استخراج الكيانات** | تحديد الأشخاص والشركات والدول | التصفية والربط |
| **تحليل الشعور** | تحديد نبرة المقال (إيجابي/سلبي) | تقييم الخطورة |
| **التصنيف** | تصنيف المقال حسب الموضوع | الفلترة والتنظيم |
| **تقييم المخاطر** | تحديد مستوى الخطورة | التنبيهات الأولوية |

---

## 🔧 التكامل مع z-ai-web-dev-sdk

### التهيئة

```typescript
import { ZAI } from 'z-ai-web-dev-sdk';

// إنشاء العميل
const ai = new ZAI({
  apiKey: process.env.Z_AI_API_KEY,
});

// نماذج متاحة
const MODELS = {
  chat: 'z-ai-chat',        // المحادثات
  completion: 'z-ai-text',  // إكمال النص
  embedding: 'z-ai-embed',  // التضمين
};
```

### نقطة نهاية API

```typescript
// src/app/api/ai/route.ts
import { ZAI } from 'z-ai-web-dev-sdk';
import { NextRequest } from 'next/server';

const ai = new ZAI({
  apiKey: process.env.Z_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, text, options } = body;
  
  switch (action) {
    case 'summarize':
      return await summarizeText(text);
    case 'analyze':
      return await analyzeArticle(text);
    case 'extract-entities':
      return await extractEntities(text);
    case 'sentiment':
      return await analyzeSentiment(text);
    default:
      return Response.json({ error: 'Unknown action' }, { status: 400 });
  }
}
```

---

## 📝 التلخيص الذكي

### الدالة الأساسية

```typescript
interface SummaryResult {
  summary: string;
  keyPoints: string[];
  confidence: number;
}

async function summarizeText(text: string): Promise<SummaryResult> {
  const prompt = `
    أنت محلل أخبار عربي خبير. قم بتلخيص النص التالي بالعربية:
    
    النص:
    """
    ${text.substring(0, 3000)}
    """
    
    قدم:
    1. ملخص مختصر (3-4 جمل كحد أقصى)
    2. أهم 3 نقاط رئيسية
    
    أعد النتيجة بصيغة JSON:
    {
      "summary": "الملخص...",
      "keyPoints": ["نقطة 1", "نقطة 2", "نقطة 3"],
      "confidence": 0.95
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت محلل أخبار عربي محترف.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    maxTokens: 500,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### الاستخدام

```typescript
// تلخيص مقال
const result = await summarizeText(article.content);

// حفظ في قاعدة البيانات
await db.article.update({
  where: { id: article.id },
  data: {
    summaryAi: result.summary,
  },
});
```

---

## 🏷️ استخراج الكيانات

### الأنواع المدعومة

```typescript
interface Entity {
  type: 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'DATE' | 'MONEY' | 'EVENT';
  text: string;
  normalized?: string;
  confidence: number;
}

interface ExtractedEntities {
  people: Entity[];
  organizations: Entity[];
  locations: Entity[];
  dates: Entity[];
  money: Entity[];
  events: Entity[];
}
```

### الدالة الأساسية

```typescript
async function extractEntities(text: string): Promise<ExtractedEntities> {
  const prompt = `
    استخرج جميع الكيانات المهمة من النص العربي التالي:
    
    "${text.substring(0, 2000)}"
    
    أعد النتيجة بصيغة JSON:
    {
      "people": [{"text": "الاسم", "confidence": 0.9}],
      "organizations": [{"text": "اسم المنظمة", "confidence": 0.85}],
      "locations": [{"text": "اسم المكان", "normalized": "الاسم الموحد"}],
      "dates": [{"text": "التاريخ كما ورد", "normalized": "YYYY-MM-DD"}],
      "money": [{"text": "المبلغ", "normalized": {"amount": 1000, "currency": "USD"}}],
      "events": [{"text": "اسم الحدث"}]
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت نظام استخراج كيانات باللغة العربية.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### حفظ الكيانات

```typescript
// استخراج وحفظ
const entities = await extractEntities(article.content);

await db.article.update({
  where: { id: article.id },
  data: {
    entities: {
      people: entities.people.map(e => e.text),
      organizations: entities.organizations.map(e => e.text),
      locations: entities.locations.map(e => e.text),
    },
  },
});
```

---

## 😊 تحليل الشعور العام

### الأنواع

```typescript
type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

interface SentimentResult {
  sentiment: SentimentType;
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  aspects?: {
    aspect: string;
    sentiment: SentimentType;
  }[];
}
```

### الدالة الأساسية

```typescript
async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const prompt = `
    حلل الشعور العام في النص العربي التالي:
    
    "${text.substring(0, 2000)}"
    
    حدد:
    1. الشعور العام (POSITIVE, NEGATIVE, NEUTRAL, MIXED)
    2. درجة الثقة (0-1)
    3. درجات كل شعور
    
    أعد النتيجة بصيغة JSON:
    {
      "sentiment": "POSITIVE",
      "confidence": 0.85,
      "scores": {
        "positive": 0.75,
        "negative": 0.10,
        "neutral": 0.15
      }
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت محلل شعور عام باللغة العربية.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 🏷️ التصنيف الذكي

### التصنيفات المتاحة

```typescript
enum ArticleCategory {
  POLITICS     = 'POLITICS',     // سياسة
  ECONOMY      = 'ECONOMY',      // اقتصاد
  SECURITY     = 'SECURITY',     // أمن
  TECHNOLOGY   = 'TECHNOLOGY',   // تقنية
  ENERGY       = 'ENERGY',       // طاقة
  HEALTH       = 'HEALTH',       // صحة
  ENVIRONMENT  = 'ENVIRONMENT',  // بيئة
  SPORTS       = 'SPORTS',       // رياضة
  CULTURE      = 'CULTURE',      // ثقافة
  OTHER        = 'OTHER',        // أخرى
}

const CATEGORY_LABELS_AR: Record<ArticleCategory, string> = {
  POLITICS: 'سياسة',
  ECONOMY: 'اقتصاد',
  SECURITY: 'أمن',
  TECHNOLOGY: 'تقنية',
  ENERGY: 'طاقة',
  HEALTH: 'صحة',
  ENVIRONMENT: 'بيئة',
  SPORTS: 'رياضة',
  CULTURE: 'ثقافة',
  OTHER: 'أخرى',
};
```

### دالة التصنيف

```typescript
interface ClassificationResult {
  category: ArticleCategory;
  confidence: number;
  subcategories?: string[];
}

async function classifyArticle(title: string, content: string): Promise<ClassificationResult> {
  const prompt = `
    صنّف المقال التالي في واحدة من التصنيفات:
    - سياسة (POLITICS)
    - اقتصاد (ECONOMY)
    - أمن (SECURITY)
    - تقنية (TECHNOLOGY)
    - طاقة (ENERGY)
    - صحة (HEALTH)
    - بيئة (ENVIRONMENT)
    - رياضة (SPORTS)
    - ثقافة (CULTURE)
    - أخرى (OTHER)
    
    العنوان: ${title}
    المحتوى: ${content.substring(0, 1000)}
    
    أعد النتيجة بصيغة JSON:
    {
      "category": "ECONOMY",
      "confidence": 0.92,
      "subcategories": ["أسواق", "استثمار"]
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت مصنّف محتوى عربي.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## ⚠️ تقييم مستوى المخاطر

### المستويات

```typescript
enum RiskLevel {
  LOW       = 'LOW',       // منخفض
  MEDIUM    = 'MEDIUM',    // متوسط
  HIGH      = 'HIGH',      // عالي
  CRITICAL  = 'CRITICAL',  // حرج
}

const RISK_LABELS_AR: Record<RiskLevel, string> = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};
```

### عوامل التقييم

```typescript
interface RiskFactors {
  // عوامل المحتوى
  hasConflictKeywords: boolean;    // كلمات صراع
  hasSecurityTerms: boolean;       // مصطلحات أمنية
  hasEconomicImpact: boolean;      // تأثير اقتصادي
  
  // عوامل المصدر
  sourceCredibility: number;       // مصداقية المصدر (0-100)
  sourceType: string;              // نوع المصدر
  
  // عوامل السياق
  countryRiskIndex: number;        // مؤشر خطر الدولة
  relatedEventsCount: number;      // عدد الأحداث المرتبطة
}
```

### دالة التقييم

```typescript
interface RiskAssessment {
  level: RiskLevel;
  confidence: number;
  factors: RiskFactors;
  reasoning: string;
}

async function assessRisk(
  article: Article, 
  context: RiskFactors
): Promise<RiskAssessment> {
  const prompt = `
    قيّم مستوى المخاطر للمقال التالي:
    
    العنوان: ${article.title}
    المحتوى: ${article.content?.substring(0, 1500)}
    
    السياق:
    - الدولة: ${article.country?.nameAr || 'غير محدد'}
    - مؤشر خطر الدولة: ${context.countryRiskIndex}
    - مصداقية المصدر: ${context.sourceCredibility}
    
    حدد مستوى الخطورة:
    - LOW: منخفض (أخبار روتينية)
    - MEDIUM: متوسط (تطورات مهمة)
    - HIGH: عالي (تطورات خطيرة)
    - CRITICAL: حرج (أزمات، حروب، كوارث)
    
    أعد النتيجة بصيغة JSON:
    {
      "level": "MEDIUM",
      "confidence": 0.88,
      "reasoning": "السبب الرئيسي للتقييم"
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت محلل مخاطر جيوسياسي.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 🔄 خط المعالجة الكامل

### معالجة مقال جديد

```typescript
async function processArticleWithAI(article: Article): Promise<void> {
  try {
    // 1. التلخيص
    const summary = await summarizeText(article.content || article.title);
    
    // 2. استخراج الكيانات
    const entities = await extractEntities(article.content || article.title);
    
    // 3. تحليل الشعور
    const sentiment = await analyzeSentiment(article.content || article.title);
    
    // 4. التصنيف
    const classification = await classifyArticle(
      article.title, 
      article.content || ''
    );
    
    // 5. تقييم المخاطر
    const risk = await assessRisk(article, {
      sourceCredibility: article.source?.credibility || 50,
      countryRiskIndex: article.country?.riskIndex || 50,
    });
    
    // 6. حفظ جميع النتائج
    await db.article.update({
      where: { id: article.id },
      data: {
        summaryAi: summary.summary,
        entities: {
          people: entities.people.map(e => e.text),
          organizations: entities.organizations.map(e => e.text),
          locations: entities.locations.map(e => e.text),
        },
        sentiment: sentiment.sentiment,
        category: classification.category,
        riskLevel: risk.level,
        aiProcessed: true,
        aiProcessedAt: new Date(),
      },
    });
    
    // 7. إنشاء Insight
    await db.insight.create({
      data: {
        type: 'SUMMARY',
        title: 'ملخص الذكاء الاصطناعي',
        titleAr: summary.summary,
        content: summary.summary,
        contentAr: summary.summary,
        confidence: summary.confidence,
        articleId: article.id,
      },
    });
    
  } catch (error) {
    console.error('AI Processing Error:', error);
    
    await db.systemLog.create({
      data: {
        level: 'ERROR',
        message: `فشل معالجة المقال ${article.id}`,
        details: { error: String(error) },
        source: 'ai-layer',
      },
    });
  }
}
```

---

## 🎯 التحليلات المتقدمة

### اكتشاف الأنماط

```typescript
interface Pattern {
  type: 'TREND' | 'ANOMALY' | 'CORRELATION';
  description: string;
  confidence: number;
  data: Record<string, unknown>;
}

async function detectPatterns(articles: Article[]): Promise<Pattern[]> {
  const prompt = `
    حلل المجموعة التالية من الأخبار واكتشف أي أنماط:
    
    ${articles.slice(0, 30).map(a => `
      - ${a.title}
        التصنيف: ${a.category}
        الدولة: ${a.country?.nameAr}
        الشعور: ${a.sentiment}
    `).join('\n')}
    
    ابحث عن:
    1. اتجاهات ناشئة
    2. أي شذوذ أو أحداث غير عادية
    3. علاقات أو روابط بين الأحداث
    
    أعد النتيجة بصيغة JSON:
    {
      "patterns": [
        {
          "type": "TREND",
          "description": "وصف النمط",
          "confidence": 0.85,
          "data": {}
        }
      ]
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت محلل بيانات ومكتشف أنماط.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
  });
  
  return JSON.parse(response.choices[0].message.content).patterns;
}
```

### التوقعات

```typescript
interface Prediction {
  type: 'EVENT' | 'TREND' | 'RISK';
  description: string;
  probability: number;
  timeframe: string;
  relatedEntities: string[];
}

async function generatePredictions(
  articles: Article[], 
  historicalData: DailyStat[]
): Promise<Prediction[]> {
  const prompt = `
    بناءً على الأخبار والبيانات التاريخية، قدم توقعات:
    
    آخر الأخبار:
    ${articles.slice(0, 20).map(a => a.title).join('\n')}
    
    البيانات التاريخية (آخر 7 أيام):
    ${historicalData.map(d => `
      ${d.date}: ${d.articlesCount} مقال، ${d.eventsCount} حدث
    `).join('\n')}
    
    قدم 3-5 توقعات قصيرة المدى (1-7 أيام):
    {
      "predictions": [
        {
          "type": "EVENT",
          "description": "وصف التوقع",
          "probability": 0.75,
          "timeframe": "3-5 أيام",
          "relatedEntities": ["الكيان 1", "الكيان 2"]
        }
      ]
    }
  `;
  
  const response = await ai.chat({
    model: 'z-ai-chat',
    messages: [
      { role: 'system', content: 'أنت محلل تنبؤات جيوسياسية.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
  });
  
  return JSON.parse(response.choices[0].message.content).predictions;
}
```

---

## ⚡ تحسين الأداء

### 1️⃣ المعالجة الدفعية

```typescript
async function batchProcess(articles: Article[], batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const processed = await Promise.all(
      batch.map(article => processArticleWithAI(article))
    );
    results.push(...processed);
    
    // تأخير لتجنب Rate Limiting
    await sleep(1000);
  }
  
  return results;
}
```

### 2️⃣ التخزين المؤقت للنتائج

```typescript
const cache = new Map<string, AIResult>();

async function getCachedOrProcess(article: Article): Promise<AIResult> {
  const cacheKey = `article:${article.id}:${article.updatedAt.getTime()}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  const result = await processArticleWithAI(article);
  cache.set(cacheKey, result);
  
  return result;
}
```

### 3️⃣ Rate Limiting

```typescript
class RateLimiter {
  private requests: number[] = [];
  private maxRequests = 60;
  private windowMs = 60000; // دقيقة
  
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await sleep(waitTime);
    }
    
    this.requests.push(now);
  }
}

const limiter = new RateLimiter();

async function safeAICall<T>(fn: () => Promise<T>): Promise<T> {
  await limiter.waitIfNeeded();
  return fn();
}
```

---

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

| المشكلة | السبب | الحل |
|---------|-------|------|
| استجابة فارغة | نص قصير جداً | إضافة سياق إضافي |
| JSON غير صالح | تنسيق خاطئ | إضافة تعليمات صارمة |
| نتائج غير دقيقة | Prompt غير واضح | تحسين التعليمات |
| تأخر الاستجابة | Rate Limiting | تقليل الطلبات |

---

*آخر تحديث: 2024*
