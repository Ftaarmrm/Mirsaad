import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  verifyAdminPassword, 
  createAdminSession,
  ADMIN_COOKIE_CONFIG 
} from '@/lib/admin-auth';
import { handleError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

const loginSchema = z.object({
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

/**
 * POST /api/admin/login
 * تسجيل دخول الأدمن
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = loginSchema.parse(body);
    
    if (!verifyAdminPassword(password)) {
      logger.warn('Failed admin login attempt', { 
        ip: request.headers.get('x-forwarded-for') || 'unknown' 
      });
      
      // تأخير عشوائي لمنع timing attacks وbrute force
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
      
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'كلمة المرور غير صحيحة' },
        },
        { status: 401 }
      );
    }
    
    const token = await createAdminSession();
    
    logger.info('Admin logged in successfully');
    
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    });
    
    response.cookies.set({
      ...ADMIN_COOKIE_CONFIG,
      value: token,
    });
    
    return response;
  } catch (error) {
    return handleError(error, 'POST /api/admin/login');
  }
}

/**
 * DELETE /api/admin/login
 * تسجيل الخروج
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج',
  });
  
  response.cookies.set({
    ...ADMIN_COOKIE_CONFIG,
    value: '',
    maxAge: 0,
  });
  
  return response;
}
