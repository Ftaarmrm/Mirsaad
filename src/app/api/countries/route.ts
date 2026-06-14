import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RiskLevel } from '@prisma/client';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Validation helpers
function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  return { page, limit };
}

function parseRiskLevel(risk?: string | null): RiskLevel | undefined {
  if (!risk) return undefined;
  const validLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  return validLevels.includes(risk.toUpperCase() as typeof validLevels[number]) 
    ? (risk.toUpperCase() as RiskLevel) 
    : undefined;
}

// GET /api/countries - Get all countries with pagination and filters
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);
    
    // Filters
    const region = searchParams.get('region');
    const regionAr = searchParams.get('regionAr');
    const riskLevel = parseRiskLevel(searchParams.get('riskLevel'));
    const minRiskIndex = searchParams.get('minRiskIndex') 
      ? parseFloat(searchParams.get('minRiskIndex')!) 
      : undefined;
    const maxRiskIndex = searchParams.get('maxRiskIndex') 
      ? parseFloat(searchParams.get('maxRiskIndex')!) 
      : undefined;
    const search = searchParams.get('search');
    const includeStats = searchParams.get('includeStats') === 'true';
    const sortBy = searchParams.get('sortBy') || 'nameAr';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Build where clause
    const where: any = {};
    
    if (region) {
      where.region = region;
    }
    
    if (regionAr) {
      where.regionAr = regionAr;
    }
    
    if (riskLevel) {
      // Note: This requires articles to have riskLevel
      // We'll filter countries by their articles' risk level if needed
    }
    
    if (minRiskIndex !== undefined || maxRiskIndex !== undefined) {
      where.riskIndex = {};
      if (minRiskIndex !== undefined) where.riskIndex.gte = minRiskIndex;
      if (maxRiskIndex !== undefined) where.riskIndex.lte = maxRiskIndex;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { code: { contains: search.toUpperCase() } },
      ];
    }

    // Get total count
    const total = await db.country.count({ where });

    // Get paginated countries
    const countries = await db.country.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Include stats if requested
    let countriesWithStats = countries;
    if (includeStats) {
      const statsPromises = countries.map(async (country) => {
        const [articleCount, eventCount, recentArticles] = await Promise.all([
          db.article.count({ where: { countryId: country.id } }),
          db.event.count({ where: { countryId: country.id } }),
          db.article.count({
            where: {
              countryId: country.id,
              fetchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
          })
        ]);
        
        // Get risk distribution
        const riskDistribution = await db.article.groupBy({
          by: ['riskLevel'],
          _count: { id: true },
          where: { 
            countryId: country.id,
            riskLevel: { not: null }
          }
        });
        
        return {
          ...country,
          stats: {
            articleCount,
            eventCount,
            recentArticles,
            riskDistribution: riskDistribution.map(r => ({
              level: r.riskLevel,
              count: r._count.id
            }))
          }
        };
      });
      countriesWithStats = await Promise.all(statsPromises);
    }

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    };

    return NextResponse.json({
      success: true,
      data: countriesWithStats,
      meta: {
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    }, { headers });
    
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'COUNTRIES_FETCH_ERROR',
        message: 'Failed to fetch countries'
      }
    }, { status: 500 });
  }
}
