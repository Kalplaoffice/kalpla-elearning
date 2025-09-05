import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = [
  '/dashboard/student',
  '/dashboard/mentor',
  '/dashboard/admin'
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedPrefixes.some(p => pathname.startsWith(p))) {
    // Check for authentication cookie or session
    const session = req.cookies.get('amplify-auth') || req.cookies.get('CognitoIdentityServiceProvider');
    
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*'
  ]
};
