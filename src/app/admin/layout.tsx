import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // صفحة تسجيل الدخول لا تحتاج حماية
  const isLoginPage = pathname.endsWith('/admin/login');
  
  if (!isLoginPage) {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      redirect('/admin/login');
    }
  }

  return <>{children}</>;
}
