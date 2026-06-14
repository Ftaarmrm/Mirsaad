import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EventType, EventSeverity, EventStatus } from '@prisma/client';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
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
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  return { page, limit };
}

function parseEventType(type?: string | null): EventType | undefined {
  if (!type) return undefined;
  const validTypes = ['CONFLICT', 'ELECTION', 'AGREEMENT', 'PROTEST', 'DISASTER', 'ANNOUNCEMENT', 'VISIT', 'MEETING', 'OTHER'] as const;
  return validTypes.includes(type.toUpperCase() as typeof validTypes[number]) 
    ? (type.toUpperCase() as EventType) 
    : undefined;
}

function parseEventSeverity(severity?: string | null): EventSeverity | undefined {
  if (!severity) return undefined;
  const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  return validSeverities.includes(severity.toUpperCase() as typeof validSeverities[number]) 
    ? (severity.toUpperCase() as EventSeverity) 
    : undefined;
}

function parseEventStatus(status?: string | null): EventStatus | undefined {
  if (!status) return undefined;
  const validStatuses = ['ACTIVE', 'ONGOING', 'RESOLVED', 'ARCHIVED'] as const;
  return validStatuses.includes(status.toUpperCase() as typeof validStatuses[number]) 
    ? (status.toUpperCase() as EventStatus) 
    : undefined;
}

function parseDate(dateStr?: string | null): Date | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? undefined : date;
}

// GET /api/events - Get events list with filters and pagination
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);
    
    // Filters
    const countryCode = searchParams.get('countryCode');
    const type = parseEventType(searchParams.get('type'));
    const severity = parseEventSeverity(searchParams.get('severity'));
    const status = parseEventStatus(searchParams.get('status'));
    const startDate = parseDate(searchParams.get('startDate'));
    const endDate = parseDate(searchParams.get('endDate'));
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'occurredAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Build where clause
    const where: any = {};
    
    // Country filter
    if (countryCode) {
      const country = await db.country.findUnique({
        where: { code: countryCode.toUpperCase() }
      });
      if (country) {
        where.countryId = country.id;
      }
    }
    
    // Type filter
    if (type) {
      where.type = type;
    }
    
    // Severity filter (support multiple)
    const severityList = searchParams.get('severityList');
    if (severityList) {
      const severities = severityList.split(',').map(s => parseEventSeverity(s)).filter(Boolean);
      if (severities.length > 0) {
        where.severity = { in: severities };
      }
    } else if (severity) {
      where.severity = severity;
    }
    
    // Status filter
    if (status) {
      where.status = status;
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) where.occurredAt.gte = startDate;
      if (endDate) where.occurredAt.lte = endDate;
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await db.event.count({ where });

    // Get paginated events
    const events = await db.event.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            nameAr: true,
            flag: true,
            region: true,
            regionAr: true
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            url: true,
            source: {
              select: { name: true, nameAr: true }
            }
          }
        }
      }
    });

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
    };

    return NextResponse.json({
      success: true,
      data: events,
      meta: {
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EVENTS_FETCH_ERROR',
        message: 'Failed to fetch events'
      }
    }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Event title is required'
        }
      }, { status: 400 });
    }

    // Find country if countryCode provided
    let countryId: string | undefined;
    if (body.countryCode) {
      const country = await db.country.findUnique({
        where: { code: body.countryCode.toUpperCase() }
      });
      if (!country) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_COUNTRY',
            message: `Country with code '${body.countryCode}' not found`
          }
        }, { status: 400 });
      }
      countryId = country.id;
    }

    // Create event
    const event = await db.event.create({
      data: {
        title: body.title.trim(),
        titleAr: body.titleAr?.trim(),
        description: body.description?.trim(),
        descriptionAr: body.descriptionAr?.trim(),
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
        location: body.location,
        coordinates: body.coordinates,
        type: parseEventType(body.type),
        severity: parseEventSeverity(body.severity),
        status: parseEventStatus(body.status) || 'ACTIVE',
        countryId,
        articleId: body.articleId
      },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            nameAr: true,
            flag: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: event
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EVENT_CREATE_ERROR',
        message: 'Failed to create event'
      }
    }, { status: 500 });
  }
}
