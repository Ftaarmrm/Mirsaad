/**
 * Simple Admin Authentication
 * نظام مصادقة بسيط للأدمن باستخدام كلمة مرور في .env
 * 
 * للإنتاج: استبدل بـ NextAuth.js أو نظام مصادقة كامل
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'mirsad_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع

/**
 * توليد توقيع session بسيط (HMAC-style)
 */
async function signSession(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || 'change-me-in-production';
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * إنشاء session token عند تسجيل الدخول
 */
export async function createAdminSession(): Promise<string> {
  const timestamp = Date.now().toString();
  const signature = await signSession(timestamp);
  return `${timestamp}.${signature}`;
}

/**
 * التحقق من صحة session token
 */
export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  
  const [timestamp, signature] = parts;
  
  // تحقق من انتهاء الصلاحية
  const tokenTime = parseInt(timestamp, 10);
  if (isNaN(tokenTime)) return false;
  
  const age = Date.now() - tokenTime;
  if (age > COOKIE_MAX_AGE * 1000) return false;
  
  // تحقق من التوقيع
  const expectedSignature = await signSession(timestamp);
  return signature === expectedSignature;
}

/**
 * التحقق من كلمة مرور الأدمن
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.warn('[Admin] ADMIN_PASSWORD is not set in .env');
    return false;
  }
  
  // مقارنة آمنة من timing attacks
  if (password.length !== adminPassword.length) return false;
  
  let result = 0;
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * التحقق من المصادقة من الـ cookies (للـ Server Components)
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

/**
 * Middleware helper للـ API routes
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = await verifyAdminSession(token);
  
  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'يتطلب صلاحيات أدمن' },
      },
      { status: 401 }
    );
  }
  
  return null;
}

/**
 * إعدادات الـ cookie
 */
export const ADMIN_COOKIE_CONFIG = {
  name: ADMIN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: COOKIE_MAX_AGE,
  path: '/',
};

export { ADMIN_COOKIE_NAME };
