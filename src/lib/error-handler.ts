import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export enum ErrorCode {
  NOT_FOUND        = 'NOT_FOUND',
  UNAUTHORIZED     = 'UNAUTHORIZED',
  FORBIDDEN        = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT         = 'CONFLICT',
  INTERNAL_ERROR   = 'INTERNAL_ERROR',
  BAD_REQUEST      = 'BAD_REQUEST',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context: string): NextResponse {
  // AppError — خطأ معروف مع كود محدد
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.status },
    );
  }

  // ZodError — خطأ التحقق من المدخلات
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'بيانات غير صالحة',
        code: ErrorCode.VALIDATION_ERROR,
        details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      },
      { status: 400 },
    );
  }

  // Prisma — سجل غير موجود
  if (
    error instanceof Error &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  ) {
    return NextResponse.json(
      { success: false, error: 'العنصر غير موجود', code: ErrorCode.NOT_FOUND },
      { status: 404 },
    );
  }

  // خطأ غير متوقع
  const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
  console.error(`[${context}] Unhandled error:`, error);

  return NextResponse.json(
    { success: false, error: message, code: ErrorCode.INTERNAL_ERROR },
    { status: 500 },
  );
}
