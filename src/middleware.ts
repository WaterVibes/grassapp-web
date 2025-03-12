import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token');
  const isAuthPage = request.nextUrl.pathname === '/budz/auth';

  // If there's no auth token and the user isn't on the auth page, redirect to auth
  if (!authToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/budz/auth', request.url));
  }

  // If there is an auth token and user is on auth page, redirect to home
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/budz', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/budz/:path*',
  ],
}; 