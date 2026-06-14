/**
 * RSS Feed Fetcher Service
 * يقوم بجلب الأخبار من مصادر RSS حقيقية وحفظها في قاعدة البيانات
 */

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { ArticleCategory } from '@prisma/client';

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  category?: string;
  enclosure?: { url: string };
  'media:content'?: { url: string };
  'media:thumbnail'?: { url: string };
}

interface FetchResult {
  sourceId: string;
  sourceName: string;
  fetched: number;
  saved: number;
  errors: number;
  error?: string;
}

/**
 * تحليل XML بسيط للـ RSS (بدون مكتبات خارجية)
 */
function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  // استخراج العناصر <item> أو <entry>
  const itemRegex = /<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/gi;
  const matches = xml.matchAll(itemRegex);
  
  for (const match of matches) {
    const itemContent = match[1] || match[2];
    if (!itemContent) continue;
    
    const item: RSSItem = {
      title: extractTag(itemContent, 'title'),
      link: extractTag(itemContent, 'link') || extractLinkHref(itemContent),
      description: extractTag(itemContent, 'description') || extractTag(itemContent, 'summary'),
      pubDate: extractTag(itemContent, 'pubDate') || extractTag(itemContent, 'published') || extractTag(itemContent, 'updated'),
      category: extractTag(itemContent, 'category'),
    };
    
    // استخراج الصورة
    const imageUrl = extractImageUrl(itemContent);
    if (imageUrl) {
      item.enclosure = { url: imageUrl };
    }
    
    if (item.title && item.link) {
      items.push(item);
    }
  }
  
  return items;
}

function extractTag(content: string, tag: string): string {
  // محاولة CDATA أولاً
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = content.match(cdataRegex);
  if (cdataMatch) return cleanText(cdataMatch[1]);
  
  // ثم النص العادي
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = content.match(regex);
  return match ? cleanText(match[1]) : '';
}

function extractLinkHref(content: string): string {
  const match = content.match(/<link[^>]*href=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

function extractImageUrl(content: string): string | null {
  // محاولة media:content
  let match = content.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (match) return match[1];
  
  // media:thumbnail
  match = content.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
  if (match) return match[1];
  
  // enclosure
  match = content.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i);
  if (match) return match[1];
  
  // img داخل description
  match = content.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (match) return match[1];
  
  return null;
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]+>/g, '') // إزالة HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * تخمين التصنيف من العنوان والوصف
 */
function guessCategory(title: string, description: string = ''): ArticleCategory {
  const text = (title + ' ' + description).toLowerCase();
  
  const keywords: Record<ArticleCategory, string[]> = {
    POLITICS: ['سياس', 'حكوم', 'رئيس', 'وزير', 'برلمان', 'انتخاب', 'دبلوماس', 'قمة'],
    ECONOMY: ['اقتصاد', 'نفط', 'بترول', 'بورصة', 'أسهم', 'دولار', 'استثمار', 'تجار', 'مال', 'بنك'],
    SECURITY: ['أمن', 'عسكر', 'جيش', 'صاروخ', 'هجوم', 'إرهاب', 'حرب', 'قتل', 'انفجار'],
    TECHNOLOGY: ['تقنية', 'تكنولوج', 'ذكاء اصطناعي', 'برمج', 'تطبيق', 'إنترنت', 'رقمي', 'هاتف'],
    ENERGY: ['طاقة', 'كهرباء', 'شمسي', 'متجدد', 'غاز', 'أوبك'],
    HEALTH: ['صحة', 'مرض', 'وباء', 'دواء', 'مستشفى', 'طب', 'كورونا'],
    ENVIRONMENT: ['بيئ', 'مناخ', 'تلوث', 'احتباس', 'استدام'],
    SPORTS: ['رياض', 'كرة', 'مباراة', 'بطولة', 'هدف', 'فريق'],
    CULTURE: ['ثقاف', 'فن', 'سينما', 'موسيق', 'كتاب', 'متحف'],
    OTHER: [],
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return category as ArticleCategory;
    }
  }
  
  return ArticleCategory.OTHER;
}

/**
 * تخمين الدولة من النص
 */
async function guessCountry(text: string): Promise<string | null> {
  const countryKeywords: Record<string, string[]> = {
    SA: ['السعودية', 'الرياض', 'جدة', 'مكة', 'المدينة', 'سعودي'],
    AE: ['الإمارات', 'دبي', 'أبوظبي', 'الشارقة', 'إماراتي'],
    EG: ['مصر', 'القاهرة', 'الإسكندرية', 'مصري'],
    QA: ['قطر', 'الدوحة', 'قطري'],
    KW: ['الكويت', 'كويتي'],
    BH: ['البحرين', 'المنامة', 'بحريني'],
    OM: ['عُمان', 'سلطنة عمان', 'مسقط', 'عماني'],
    JO: ['الأردن', 'عمّان', 'أردني'],
    LB: ['لبنان', 'بيروت', 'لبناني'],
    SY: ['سوريا', 'دمشق', 'سوري'],
    IQ: ['العراق', 'بغداد', 'عراقي'],
    YE: ['اليمن', 'صنعاء', 'يمني'],
    LY: ['ليبيا', 'طرابلس', 'ليبي'],
    TN: ['تونس', 'تونسي'],
    DZ: ['الجزائر', 'جزائري'],
    MA: ['المغرب', 'الرباط', 'الدار البيضاء', 'مغربي'],
    SD: ['السودان', 'الخرطوم', 'سوداني'],
    PS: ['فلسطين', 'غزة', 'الضفة', 'القدس', 'فلسطيني'],
  };
  
  for (const [code, keywords] of Object.entries(countryKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      const country = await db.country.findUnique({ where: { code } });
      return country?.id || null;
    }
  }
  
  return null;
}

/**
 * جلب الأخبار من مصدر RSS واحد
 */
export async function fetchSourceRSS(sourceId: string): Promise<FetchResult> {
  const source = await db.source.findUnique({ where: { id: sourceId } });
  
  if (!source) {
    return {
      sourceId,
      sourceName: 'Unknown',
      fetched: 0,
      saved: 0,
      errors: 1,
      error: 'Source not found',
    };
  }
  
  if (!source.feedUrl) {
    return {
      sourceId,
      sourceName: source.name,
      fetched: 0,
      saved: 0,
      errors: 1,
      error: 'No feed URL configured',
    };
  }
  
  logger.info('Fetching RSS feed', { source: source.name, url: source.feedUrl });
  
  try {
    // جلب RSS
    const response = await fetch(source.feedUrl, {
      headers: {
        'User-Agent': 'Mirsad/1.0 (Arabic News Monitor)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(30000), // 30 ثانية timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const xml = await response.text();
    const items = parseRSS(xml);
    
    logger.info('Parsed RSS items', { source: source.name, count: items.length });
    
    let saved = 0;
    let errors = 0;
    
    // حفظ المقالات في قاعدة البيانات
    for (const item of items.slice(0, 30)) { // الحد الأقصى 30 مقالة لكل مصدر
      try {
        // التحقق من وجود المقال مسبقاً (بناءً على URL الفريد)
        const existing = await db.article.findUnique({
          where: { url: item.link },
        });
        
        if (existing) continue;
        
        // تخمين التصنيف والدولة
        const category = guessCategory(item.title, item.description || '');
        const countryId = await guessCountry(item.title + ' ' + (item.description || ''));
        
        // حفظ المقال
        await db.article.create({
          data: {
            title: item.title,
            titleAr: item.title, // الأخبار العربية بالفعل
            content: item.description,
            summary: item.description?.slice(0, 300),
            url: item.link,
            imageUrl: item.enclosure?.url,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            fetchedAt: new Date(),
            category,
            sourceId: source.id,
            countryId,
            aiProcessed: false,
          },
        });
        
        saved++;
      } catch (err) {
        errors++;
        logger.warn('Failed to save article', { 
          title: item.title?.slice(0, 50),
          error: err instanceof Error ? err.message : 'Unknown'
        });
      }
    }
    
    // تحديث آخر جلب للمصدر
    await db.source.update({
      where: { id: source.id },
      data: {
        lastFetched: new Date(),
        fetchCount: { increment: 1 },
      },
    });
    
    logger.info('RSS fetch completed', { 
      source: source.name, 
      fetched: items.length, 
      saved, 
      errors 
    });
    
    return {
      sourceId: source.id,
      sourceName: source.name,
      fetched: items.length,
      saved,
      errors,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('RSS fetch failed', error, { source: source.name });
    
    return {
      sourceId: source.id,
      sourceName: source.name,
      fetched: 0,
      saved: 0,
      errors: 1,
      error: errorMsg,
    };
  }
}

/**
 * جلب جميع المصادر النشطة
 */
export async function fetchAllSources(): Promise<FetchResult[]> {
  const sources = await db.source.findMany({
    where: { isActive: true, type: 'RSS' },
  });
  
  logger.info('Starting RSS fetch for all sources', { count: sources.length });
  
  // جلب بالتوازي مع حد أقصى 5 في نفس الوقت
  const results: FetchResult[] = [];
  const batchSize = 5;
  
  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(source => fetchSourceRSS(source.id))
    );
    results.push(...batchResults);
  }
  
  const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);
  logger.info('RSS fetch completed for all sources', { 
    totalSources: sources.length,
    totalSaved,
  });
  
  return results;
}
