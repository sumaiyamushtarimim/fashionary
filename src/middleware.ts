
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/shop(.*)',
    '/track-order(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = auth();

    if (!userId) {
      return redirectToSignIn();
    }

    const role = (sessionClaims?.publicMetadata as any)?.role;
    const pathname = req.nextUrl.pathname;

    // --- Role-Based Access Control ---

    // 1. Packing Assistant Role
    if (role === 'Packing Assistant') {
      const allowedPaths = ['/dashboard/packing-orders', '/dashboard/account'];
      if (!allowedPaths.some(path => pathname.startsWith(path))) {
        // Redirect them to their main page if they try to access anything else
        return NextResponse.redirect(new URL('/dashboard/packing-orders', req.url));
      }
    }
    
    // Future roles can be added here. Example for a 'Seller' role:
    /*
    if (role === 'Seller') {
      const allowedPaths = ['/dashboard/orders', '/dashboard/customers', '/dashboard/account'];
      if (!allowedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/dashboard/orders', req.url));
      }
    }
    */
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
