import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROUTES = {
  PUBLIC: [
    '/auth/login',
    '/auth/resetpassword',
    '/logout',
    '/not-found',
    '/error'
  ],
  PROTECTED: {
    SUPER_ADMIN: [
      '/super-admin',
    ],
    HOTEL_PANEL: [
      '/hotel-panel'
    ]
  }
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  const isPublicRoute = ROUTES.PUBLIC.some(route => 
    path === route || path.startsWith(route)
  );

  const isProtectedSuperAdmin = ROUTES.PROTECTED.SUPER_ADMIN.some(route => 
    path === route || path.startsWith(route)
  );
  const isProtectedHotelPanel = ROUTES.PROTECTED.HOTEL_PANEL.some(route => 
    path === route || path.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }
  if ((isProtectedSuperAdmin || isProtectedHotelPanel) && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (path === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/hotel-panel/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/logout',
    '/not-found',
    '/error',

    '/super-admin/:path*',
    '/hotel-panel/:path*',
  ]
};