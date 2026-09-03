import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('bi_token');

  const { pathname } = request.nextUrl;

  // Protect configuration routes and dashboard routes
  const isProtectedPath = pathname === '/' || 
                          pathname.startsWith('/rateio') || 
                          pathname.startsWith('/juridico') || 
                          pathname.startsWith('/rh') || 
                          pathname.startsWith('/diretoria') || 
                          pathname.startsWith('/configuracoes');

  if (isProtectedPath && !token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users from accessing the login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
