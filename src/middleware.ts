import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('bi_token');

  const { pathname } = request.nextUrl;

  // Protect configuration routes and dashboard routes
  const isProtectedPath = pathname.startsWith('/configuracoes') || pathname.startsWith('/dashboard');

  if (isProtectedPath && !token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users from accessing the login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/configuracoes', request.url)); // Default redirect after login
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/configuracoes/:path*', '/dashboard/:path*', '/login'],
};
