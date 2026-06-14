import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AlertFrequency } from '@prisma/client';

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

function parseAlertFrequency(frequency?: string | null): AlertFrequency | undefined {
  if (!frequency) return undefined;
  const validFrequencies = ['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY'] as const;
  return validFrequencies.includes(frequency.toUpperCase() as typeof validFrequencies[number]) 
    ? (frequency.toUpperCase() as AlertFrequency) 
    : undefined;
}

function validateJsonArray(value: any, fieldName: string): { valid: boolean; error?: string } {
  if (value === undefined || value === null) return { valid: true };
  if (!Array.isArray(value)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }
  return { valid: true };
}

// GET /api/alerts - Get alerts list with pagination
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);
    
    // Filters
    const isActive = searchParams.get('isActive');
    const frequency = parseAlertFrequency(searchParams.get('frequency'));
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Build where clause
    const where: any = {};
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    if (frequency) {
      where.frequency = frequency;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await db.alert.count({ where });

    // Get paginated alerts
    const alerts = await db.alert.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
    };

    return NextResponse.json({
      success: true,
      data: alerts,
      meta: {
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'ALERTS_FETCH_ERROR',
        message: 'Failed to fetch alerts'
      }
    }, { status: 500 });
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json();
    
    // Validation
    const errors: string[] = [];
    
    if (!body.name || body.name.trim().length === 0) {
      errors.push('Alert name is required');
    }
    
    // Validate JSON arrays
    const keywordsValidation = validateJsonArray(body.keywords, 'Keywords');
    if (!keywordsValidation.valid) errors.push(keywordsValidation.error!);
    
    const countriesValidation = validateJsonArray(body.countries, 'Countries');
    if (!countriesValidation.valid) errors.push(countriesValidation.error!);
    
    const categoriesValidation = validateJsonArray(body.categories, 'Categories');
    if (!categoriesValidation.valid) errors.push(categoriesValidation.error!);
    
    const riskLevelsValidation = validateJsonArray(body.riskLevels, 'Risk levels');
    if (!riskLevelsValidation.valid) errors.push(riskLevelsValidation.error!);
    
    const sourcesValidation = validateJsonArray(body.sources, 'Sources');
    if (!sourcesValidation.valid) errors.push(sourcesValidation.error!);
    
    const channelsValidation = validateJsonArray(body.channels, 'Channels');
    if (!channelsValidation.valid) errors.push(channelsValidation.error!);

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      }, { status: 400 });
    }

    // Create alert
    const alert = await db.alert.create({
      data: {
        name: body.name.trim(),
        nameAr: body.nameAr?.trim(),
        description: body.description?.trim(),
        descriptionAr: body.descriptionAr?.trim(),
        keywords: body.keywords,
        countries: body.countries,
        categories: body.categories,
        riskLevels: body.riskLevels,
        sources: body.sources,
        channels: body.channels,
        isActive: body.isActive !== false,
        frequency: parseAlertFrequency(body.frequency) || 'IMMEDIATE'
      }
    });

    return NextResponse.json({
      success: true,
      data: alert
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'ALERT_CREATE_ERROR',
        message: 'Failed to create alert'
      }
    }, { status: 500 });
  }
}

// PUT /api/alerts - Update an existing alert
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert ID is required'
        }
      }, { status: 400 });
    }

    // Check if alert exists
    const existingAlert = await db.alert.findUnique({
      where: { id: body.id }
    });

    if (!existingAlert) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ALERT_NOT_FOUND',
          message: `Alert with ID '${body.id}' not found`
        }
      }, { status: 404 });
    }

    // Validate JSON arrays if provided
    const errors: string[] = [];
    
    const keywordsValidation = validateJsonArray(body.keywords, 'Keywords');
    if (!keywordsValidation.valid) errors.push(keywordsValidation.error!);
    
    const countriesValidation = validateJsonArray(body.countries, 'Countries');
    if (!countriesValidation.valid) errors.push(countriesValidation.error!);
    
    const categoriesValidation = validateJsonArray(body.categories, 'Categories');
    if (!categoriesValidation.valid) errors.push(categoriesValidation.error!);
    
    const riskLevelsValidation = validateJsonArray(body.riskLevels, 'Risk levels');
    if (!riskLevelsValidation.valid) errors.push(riskLevelsValidation.error!);
    
    const sourcesValidation = validateJsonArray(body.sources, 'Sources');
    if (!sourcesValidation.valid) errors.push(sourcesValidation.error!);
    
    const channelsValidation = validateJsonArray(body.channels, 'Channels');
    if (!channelsValidation.valid) errors.push(channelsValidation.error!);

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      }, { status: 400 });
    }

    // Build update data
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr?.trim();
    if (body.description !== undefined) updateData.description = body.description?.trim();
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr?.trim();
    if (body.keywords !== undefined) updateData.keywords = body.keywords;
    if (body.countries !== undefined) updateData.countries = body.countries;
    if (body.categories !== undefined) updateData.categories = body.categories;
    if (body.riskLevels !== undefined) updateData.riskLevels = body.riskLevels;
    if (body.sources !== undefined) updateData.sources = body.sources;
    if (body.channels !== undefined) updateData.channels = body.channels;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.frequency !== undefined) updateData.frequency = parseAlertFrequency(body.frequency) || existingAlert.frequency;

    // Update alert
    const alert = await db.alert.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'ALERT_UPDATE_ERROR',
        message: 'Failed to update alert'
      }
    }, { status: 500 });
  }
}

// DELETE /api/alerts - Delete an alert
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert ID is required'
        }
      }, { status: 400 });
    }

    // Check if alert exists
    const existingAlert = await db.alert.findUnique({
      where: { id }
    });

    if (!existingAlert) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ALERT_NOT_FOUND',
          message: `Alert with ID '${id}' not found`
        }
      }, { status: 404 });
    }

    // Delete alert
    await db.alert.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      data: { id }
    });

  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'ALERT_DELETE_ERROR',
        message: 'Failed to delete alert'
      }
    }, { status: 500 });
  }
}
