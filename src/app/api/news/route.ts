import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ArticleCategory, RiskLevel, SentimentType } from '@prisma/client';

// GET /api/news - Get articles with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search');
    const category = searchParams.get('category') as ArticleCategory | null;
    const countryId = searchParams.get('countryId');
    const sourceId = searchParams.get('sourceId');
    const riskLevel = searchParams.get('riskLevel') as RiskLevel | null;
    const sentiment = searchParams.get('sentiment') as SentimentType | null;
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { content: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (sourceId) {
      where.sourceId = sourceId;
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    if (sentiment) {
      where.sentiment = sentiment;
    }

    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) {
        (where.publishedAt as Record<string, Date>).gte = new Date(dateFrom);
      }
      if (dateTo) {
        (where.publishedAt as Record<string, Date>).lte = new Date(dateTo);
      }
    }

    // Get articles with pagination
    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          source: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              credibility: true,
            },
          },
          country: {
            select: {
              id: true,
              code: true,
              name: true,
              nameAr: true,
            },
          },
        },
      }),
      db.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      meta: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ARTICLES_ERROR',
          message: 'Failed to fetch articles',
        },
      },
      { status: 500 }
    );
  }
}
