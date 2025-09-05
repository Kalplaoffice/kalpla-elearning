import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based route mapping
const roleRoutes = {
  '/dashboard/student': 'Student',
  '/dashboard/mentor': 'Mentor', 
  '/dashboard/admin': 'Admin'
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if accessing a role-specific dashboard
  for (const [route, requiredRole] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      // Check for authentication cookie or session
      const session = req.cookies.get('amplify-auth') || req.cookies.get('CognitoIdentityServiceProvider');
      
      if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      // Note: Role checking is handled client-side in the dashboard components
      // This middleware only ensures authentication
      break;
    }
  }

  // Redirect /dashboard to role-based dashboard (handled client-side)
  if (pathname === '/dashboard') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*'
  ]
};
