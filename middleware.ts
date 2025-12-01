import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route types
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

  // Check if route is public
  const isPublicRoute = ROUTES.PUBLIC.some(route => 
    path === route || path.startsWith(route)
  );

  // Check protected route categories
  const isProtectedSuperAdmin = ROUTES.PROTECTED.SUPER_ADMIN.some(route => 
    path === route || path.startsWith(route)
  );
  const isProtectedHotelPanel = ROUTES.PROTECTED.HOTEL_PANEL.some(route => 
    path === route || path.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if no token exists for protected routes
  if ((isProtectedSuperAdmin || isProtectedHotelPanel) && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If logged in and trying to access login, redirect to appropriate dashboard
  if (path === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/hotel-panel/dashboard', req.url));
  }

  return NextResponse.next();
}

// Configure middleware to run on specific routes
export const config = {
  matcher: [
    // Public routes
    '/auth/:path*',
    '/logout',
    '/not-found',
    '/error',

    // Protected routes
    '/super-admin/:path*',
    '/hotel-panel/:path*',
  ]
};