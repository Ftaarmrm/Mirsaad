import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { handleError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

// ============================================
// Validation Schemas
// ============================================

const adPositionEnum = z.enum([
  'HOME_TOP', 'HOME_SIDEBAR', 'HOME_MIDDLE', 'HOME_BOTTOM',
  'NEWS_TOP', 'NEWS_INFEED', 'NEWS_BOTTOM', 'NEWS_SIDEBAR',
  'ARTICLE_TOP', 'ARTICLE_INLINE', 'ARTICLE_BOTTOM',
  'COUNTRY_TOP', 'COUNTRY_BOTTOM',
  'ANALYTICS_TOP', 'ANALYTICS_BOTTOM',
  'FOOTER', 'CUSTOM',
]);

const adFormatEnum = z.enum([
  'AUTO', 'RECTANGLE', 'HORIZONTAL', 'VERTICAL', 
  'FLUID', 'SQUARE'
]);

const adSlotCreateSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').max(100),
  description: z.string().max(500).optional(),
  slotId: z.string().min(1, 'Slot ID مطلوب'),
  clientId: z.string().optional(),
  position: adPositionEnum,
  format: adFormatEnum.default('AUTO'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  responsive: z.boolean().default(true),
  layout: z.string().optional(),
  layoutKey: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
  showLabel: z.boolean().default(true),
  labelText: z.string().default('إعلان'),
  customStyle: z.any().optional(),
});

const adSlotUpdateSchema = adSlotCreateSchema.partial();

// ============================================
// GET /api/admin/ads
// جلب جميع الإعلانات (عام - يستخدمه AdUnit)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get('position');
    const activeOnly = searchParams.get('activeOnly') !== 'false';
    
    const where: any = {};
    if (position) where.position = position;
    if (activeOnly) where.isActive = true;
    
    const ads = await db.adSlot.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    return NextResponse.json({
      success: true,
      data: ads,
      meta: { total: ads.length },
    });
  } catch (error) {
    return handleError(error, 'GET /api/admin/ads');
  }
}

// ============================================
// POST /api/admin/ads
// إضافة إعلان جديد (يتطلب أدمن)
// ============================================

export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const authError = await requireAdmin(request);
    if (authError) return authError;
    
    const body = await request.json();
    const data = adSlotCreateSchema.parse(body);
    
    const adSlot = await db.adSlot.create({ data });
    
    logger.info('Ad slot created', { 
      id: adSlot.id, 
      name: adSlot.name, 
      position: adSlot.position 
    });
    
    return NextResponse.json({
      success: true,
      data: adSlot,
      message: 'تم إنشاء الإعلان بنجاح',
    }, { status: 201 });
  } catch (error) {
    return handleError(error, 'POST /api/admin/ads');
  }
}
