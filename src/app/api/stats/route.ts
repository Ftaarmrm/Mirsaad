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

// GET /api/stats - Get dashboard statistics
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeComparison = searchParams.get('includeComparison') !== 'false';
    const includeTrending = searchParams.get('includeTrending') === 'true';
    const period = searchParams.get('period') || '7d'; // 24h, 7d, 30d

    // Calculate date ranges
    const now = new Date();
    let periodStart: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    switch (period) {
      case '24h':
        periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        previousPeriodEnd = periodStart;
        break;
      case '30d':
        periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = periodStart;
        break;
      default: // 7d
        periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = periodStart;
    }

    // Get current period counts
    const [
      currentArticles,
      currentEvents,
      currentSources,
      currentAlerts
    ] = await Promise.all([
      db.article.count({
        where: { fetchedAt: { gte: periodStart } }
      }),
      db.event.count({
        where: { occurredAt: { gte: periodStart } }
      }),
      db.source.count({
        where: { isActive: true }
      }),
      db.alert.count({
        where: { isActive: true }
      })
    ]);

    // Get total counts
    const [
      totalArticles,
      totalCountries,
      totalEvents
    ] = await Promise.all([
      db.article.count(),
      db.country.count(),
      db.event.count()
    ]);

    // Build response data
    const data: any = {
      overview: {
        articles: {
          total: totalArticles,
          current: currentArticles
        },
        events: {
          total: totalEvents,
          current: currentEvents
        },
        sources: {
          active: currentSources
        },
        alerts: {
          active: currentAlerts
        },
        countries: {
          total: totalCountries
        }
      }
    };

    // Include comparison with previous period
    if (includeComparison) {
      const [
        previousArticles,
        previousEvents
      ] = await Promise.all([
        db.article.count({
          where: {
            fetchedAt: {
              gte: previousPeriodStart,
              lt: previousPeriodEnd
            }
          }
        }),
        db.event.count({
          where: {
            occurredAt: {
              gte: previousPeriodStart,
              lt: previousPeriodEnd
            }
          }
        })
      ]);

      // Calculate percentage changes
      const articlesChange = previousArticles > 0 
        ? ((currentArticles - previousArticles) / previousArticles) * 100 
        : 0;
      const eventsChange = previousEvents > 0 
        ? ((currentEvents - previousEvents) / previousEvents) * 100 
        : 0;

      data.comparison = {
        articles: {
          previous: previousArticles,
          change: Math.round(articlesChange * 10) / 10,
          trend: articlesChange > 0 ? 'up' : articlesChange < 0 ? 'down' : 'stable'
        },
        events: {
          previous: previousEvents,
          change: Math.round(eventsChange * 10) / 10,
          trend: eventsChange > 0 ? 'up' : eventsChange < 0 ? 'down' : 'stable'
        }
      };
    }

    // Include trending data
    if (includeTrending) {
      // Get daily stats for the period
      const dailyStats = await getDailyStats(periodStart, now);
      
      // Get trending countries
      const trendingCountries = await db.country.findMany({
        where: {
          articles: {
            some: {
              fetchedAt: { gte: periodStart }
            }
          }
        },
        orderBy: {
          articleCount: 'desc'
        },
        take: 5,
        select: {
          id: true,
          code: true,
          name: true,
          nameAr: true,
          flag: true,
          articleCount: true
        }
      });

      // Get trending topics/categories
      const trendingCategories = await db.article.groupBy({
        by: ['category'],
        _count: { id: true },
        where: {
          fetchedAt: { gte: periodStart },
          category: { not: null }
        },
        orderBy: {
          _count: { id: 'desc' }
        },
        take: 5
      });

      // Get trending risk levels
      const riskDistribution = await db.article.groupBy({
        by: ['riskLevel'],
        _count: { id: true },
        where: {
          fetchedAt: { gte: periodStart },
          riskLevel: { not: null }
        }
      });

      data.trending = {
        dailyStats,
        countries: trendingCountries,
        categories: trendingCategories.map(c => ({
          category: c.category,
          count: c._count.id
        })),
        riskDistribution: riskDistribution.map(r => ({
          level: r.riskLevel,
          count: r._count.id
        }))
      };
    }

    // Get articles by category (always included)
    const articlesByCategory = await db.article.groupBy({
      by: ['category'],
      _count: { id: true },
      where: {
        category: { not: null }
      }
    });

    data.categories = articlesByCategory.map(item => ({
      category: item.category,
      count: item._count.id
    }));

    // Get top countries by article count
    const topCountries = await db.country.findMany({
      orderBy: { articleCount: 'desc' },
      take: 5,
      select: {
        id: true,
        code: true,
        name: true,
        nameAr: true,
        flag: true,
        articleCount: true,
        eventCount: true,
        riskIndex: true
      }
    });

    data.topCountries = topCountries;

    // Get recent activity
    const recentActivity = await getRecentActivity();
    data.recentActivity = recentActivity;

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    };

    return NextResponse.json({
      success: true,
      data
    }, { headers });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'STATS_FETCH_ERROR',
        message: 'Failed to fetch statistics'
      }
    }, { status: 500 });
  }
}

// Helper function to get daily stats
async function getDailyStats(startDate: Date, endDate: Date) {
  const stats = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayStart = new Date(current);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(current);
    dayEnd.setHours(23, 59, 59, 999);

    const [articlesCount, eventsCount] = await Promise.all([
      db.article.count({
        where: {
          fetchedAt: { gte: dayStart, lte: dayEnd }
        }
      }),
      db.event.count({
        where: {
          occurredAt: { gte: dayStart, lte: dayEnd }
        }
      })
    ]);

    stats.push({
      date: dayStart.toISOString().split('T')[0],
      articles: articlesCount,
      events: eventsCount
    });

    current.setDate(current.getDate() + 1);
  }

  return stats;
}

// Helper function to get recent activity
async function getRecentActivity() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [recentArticles, recentEvents] = await Promise.all([
    db.article.findMany({
      where: { fetchedAt: { gte: last24Hours } },
      take: 5,
      orderBy: { fetchedAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleAr: true,
        fetchedAt: true,
        riskLevel: true,
        country: {
          select: { code: true, nameAr: true, flag: true }
        }
      }
    }),
    db.event.findMany({
      where: { occurredAt: { gte: last24Hours } },
      take: 5,
      orderBy: { occurredAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleAr: true,
        occurredAt: true,
        type: true,
        severity: true,
        country: {
          select: { code: true, nameAr: true, flag: true }
        }
      }
    })
  ]);

  return {
    articles: recentArticles,
    events: recentEvents
  };
}
