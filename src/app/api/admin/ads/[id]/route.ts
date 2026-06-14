import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { handleError, AppError, ErrorCode } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

const adPositionEnum = z.enum([
  'HOME_TOP', 'HOME_SIDEBAR', 'HOME_MIDDLE', 'HOME_BOTTOM',
  'NEWS_TOP', 'NEWS_INFEED', 'NEWS_BOTTOM', 'NEWS_SIDEBAR',
  'ARTICLE_TOP', 'ARTICLE_INLINE', 'ARTICLE_BOTTOM',
  'COUNTRY_TOP', 'COUNTRY_BOTTOM',
  'ANALYTICS_TOP', 'ANALYTICS_BOTTOM',
  'FOOTER', 'CUSTOM',
]);

const adFormatEnum = z.enum([
  'AUTO', 'RECTANGLE', 'HORIZONTAL', 'VERTICAL', 'FLUID', 'SQUARE'
]);

const adSlotUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  slotId: z.string().min(1).optional(),
  clientId: z.string().optional(),
  position: adPositionEnum.optional(),
  format: adFormatEnum.optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  responsive: z.boolean().optional(),
  layout: z.string().nullable().optional(),
  layoutKey: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  priority: z.number().int().optional(),
  showLabel: z.boolean().optional(),
  labelText: z.string().optional(),
  customStyle: z.any().optional(),
});

// ============================================
// GET /api/admin/ads/[id]
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const adSlot = await db.adSlot.findUnique({ where: { id } });
    
    if (!adSlot) {
      throw new AppError(ErrorCode.NOT_FOUND, 'الإعلان غير موجود', 404);
    }
    
    return NextResponse.json({
      success: true,
      data: adSlot,
    });
  } catch (error) {
    return handleError(error, 'GET /api/admin/ads/[id]');
  }
}

// ============================================
// PUT /api/admin/ads/[id]
// تحديث إعلان (يتطلب أدمن)
// ============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    
    const { id } = await params;
    const body = await request.json();
    const data = adSlotUpdateSchema.parse(body);
    
    const adSlot = await db.adSlot.update({
      where: { id },
      data,
    });
    
    logger.info('Ad slot updated', { id, name: adSlot.name });
    
    return NextResponse.json({
      success: true,
      data: adSlot,
      message: 'تم تحديث الإعلان بنجاح',
    });
  } catch (error) {
    return handleError(error, 'PUT /api/admin/ads/[id]');
  }
}

// ============================================
// DELETE /api/admin/ads/[id]
// حذف إعلان (يتطلب أدمن)
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    
    const { id } = await params;
    
    await db.adSlot.delete({ where: { id } });
    
    logger.info('Ad slot deleted', { id });
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف الإعلان',
    });
  } catch (error) {
    return handleError(error, 'DELETE /api/admin/ads/[id]');
  }
}
