import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — Auth Guard
 *
 * Protects dashboard routes by checking for auth token in cookies.
 * The login page and public assets are excluded from protection.
 *
 * Note: In dev mode, this is effectively a pass-through since
 * the token is stored in localStorage (client-side only).
 * For production, the login flow should set an HttpOnly cookie.
 */

const PUBLIC_PATHS = ['/login', '/api', '/_next', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for auth cookie (production) or skip in dev
  // In development, auth is handled client-side via localStorage
  // In production, set a `pallicare_session` cookie during login
  const sessionCookie = request.cookies.get('pallicare_session');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
