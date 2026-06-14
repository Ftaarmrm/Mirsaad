import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// GET /api/countries/[code] - Get country details with news and events
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { code } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination for articles and events
    const articlesLimit = Math.min(50, parseInt(searchParams.get('articlesLimit') || '10', 10));
    const eventsLimit = Math.min(50, parseInt(searchParams.get('eventsLimit') || '10', 10));
    const timelineLimit = Math.min(50, parseInt(searchParams.get('timelineLimit') || '20', 10));
    
    // Filters
    const includeArticles = searchParams.get('includeArticles') !== 'false';
    const includeEvents = searchParams.get('includeEvents') !== 'false';
    const includeTimeline = searchParams.get('includeTimeline') !== 'false';
    const includeInsights = searchParams.get('includeInsights') === 'true';

    // Find country by code
    const country = await db.country.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!country) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'COUNTRY_NOT_FOUND',
          message: `Country with code '${code}' not found`
        }
      }, { status: 404 });
    }

    // Prepare includes object
    const result: any = { ...country };

    // Fetch articles
    if (includeArticles) {
      const articles = await db.article.findMany({
        where: { countryId: country.id },
        take: articlesLimit,
        orderBy: { publishedAt: 'desc' },
        include: {
          source: {
            select: { id: true, name: true, nameAr: true, credibility: true }
          }
        }
      });
      
      const totalArticles = await db.article.count({
        where: { countryId: country.id }
      });
      
      result.articles = {
        data: articles,
        total: totalArticles,
        hasMore: totalArticles > articlesLimit
      };
    }

    // Fetch events
    if (includeEvents) {
      const events = await db.event.findMany({
        where: { countryId: country.id },
        take: eventsLimit,
        orderBy: { occurredAt: 'desc' }
      });
      
      const totalEvents = await db.event.count({
        where: { countryId: country.id }
      });
      
      result.events = {
        data: events,
        total: totalEvents,
        hasMore: totalEvents > eventsLimit
      };
    }

    // Fetch timeline
    if (includeTimeline) {
      const timeline = await db.timelineItem.findMany({
        where: { countryId: country.id },
        take: timelineLimit,
        orderBy: { date: 'desc' }
      });
      
      result.timeline = timeline;
    }

    // Fetch insights (if requested)
    if (includeInsights) {
      // Get articles with AI insights for this country
      const articlesWithInsights = await db.article.findMany({
        where: { 
          countryId: country.id,
          insights: { some: {} }
        },
        take: 5,
        orderBy: { publishedAt: 'desc' },
        include: {
          insights: {
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        }
      });
      
      result.insights = articlesWithInsights.flatMap(a => a.insights);
    }

    // Get latest news stats
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      articles24h: await db.article.count({
        where: { countryId: country.id, fetchedAt: { gte: last24Hours } }
      }),
      articles7d: await db.article.count({
        where: { countryId: country.id, fetchedAt: { gte: last7Days } }
      }),
      events24h: await db.event.count({
        where: { countryId: country.id, occurredAt: { gte: last24Hours } }
      }),
      events7d: await db.event.count({
        where: { countryId: country.id, occurredAt: { gte: last7Days } }
      })
    };

    // Get risk distribution
    const riskDistribution = await db.article.groupBy({
      by: ['riskLevel'],
      _count: { id: true },
      where: {
        countryId: country.id,
        riskLevel: { not: null }
      }
    });

    // Get category distribution
    const categoryDistribution = await db.article.groupBy({
      by: ['category'],
      _count: { id: true },
      where: {
        countryId: country.id,
        category: { not: null }
      }
    });

    result.stats = {
      ...stats,
      riskDistribution: riskDistribution.map(r => ({
        level: r.riskLevel,
        count: r._count.id
      })),
      categoryDistribution: categoryDistribution.map(c => ({
        category: c.category,
        count: c._count.id
      }))
    };

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
    };

    return NextResponse.json({
      success: true,
      data: result
    }, { headers });

  } catch (error) {
    console.error('Error fetching country:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'COUNTRY_FETCH_ERROR',
        message: 'Failed to fetch country details'
      }
    }, { status: 500 });
  }
}
