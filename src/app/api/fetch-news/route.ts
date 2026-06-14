import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSources, fetchSourceRSS } from '@/lib/rss-fetcher';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/error-handler';

/**
 * POST /api/fetch-news
 * تشغيل جلب الأخبار من جميع مصادر RSS
 * 
 * يمكن استدعاؤها:
 * 1. يدوياً من الواجهة
 * 2. عبر cron job خارجي (Vercel Cron, GitHub Actions, etc.)
 * 3. عبر Coolify scheduled task
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // التحقق من API key للحماية (اختياري لكن مستحسن)
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');
    const expectedKey = process.env.FETCH_NEWS_API_KEY;
    
    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } },
        { status: 401 }
      );
    }
    
    const body = await request.json().catch(() => ({}));
    const { sourceId } = body;
    
    let results;
    if (sourceId) {
      // جلب من مصدر واحد
      results = [await fetchSourceRSS(sourceId)];
    } else {
      // جلب من جميع المصادر
      results = await fetchAllSources();
    }
    
    const duration = Date.now() - startTime;
    const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);
    const totalFetched = results.reduce((sum, r) => sum + r.fetched, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
    
    logger.info('News fetch completed', {
      sources: results.length,
      totalFetched,
      totalSaved,
      totalErrors,
      duration: `${duration}ms`,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          sources: results.length,
          totalFetched,
          totalSaved,
          totalErrors,
          duration: `${duration}ms`,
        },
      },
    });
  } catch (error) {
    return handleError(error, 'POST /api/fetch-news');
  }
}

/**
 * GET /api/fetch-news
 * نفس الوظيفة لكن GET لسهولة الاختبار من المتصفح/cron
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
