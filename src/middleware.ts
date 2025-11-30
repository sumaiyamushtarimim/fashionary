
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { Permission, StaffMember } from '@/types';

const isPublicRoute = createRouteMatcher([
    '/shop(.*)',
    '/track-order(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
    '/api/delivery-report(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

const pagePermissions: Record<string, keyof StaffMember['permissions']> = {
    '/dashboard/orders': 'orders',
    '/dashboard/packing-orders': 'packingOrders',
    '/dashboard/products': 'products',
    '/dashboard/inventory': 'inventory',
    '/dashboard/customers': 'customers',
    '/dashboard/purchases': 'purchases',
    '/dashboard/expenses': 'expenses',
    '/dashboard/check-passing': 'checkPassing',
    '/dashboard/partners': 'partners',
    '/dashboard/courier-report': 'courierReport',
    '/dashboard/analytics': 'analytics',
    '/dashboard/accounting': 'accounting',
    '/dashboard/staff': 'staff',
    '/dashboard/settings': 'settings',
    '/dashboard/issues': 'issues',
    '/dashboard/attendance': 'attendance',
};

const hasReadAccess = (permission: Permission | boolean | undefined): boolean => {
    if (permission === undefined) return false;
    if (typeof permission === 'boolean') return permission;
    return permission.read;
};

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionClaims } = auth().protect();

    const pathname = req.nextUrl.pathname;
    
    // Directly use the permissions object from metadata. This is the source of truth.
    const userPermissions = sessionClaims?.publicMetadata?.permissions as StaffMember['permissions'] | undefined;
    
    // Allow access to core dashboard pages for any authenticated user with a permission set.
    if (pathname === '/dashboard' || pathname === '/dashboard/account' || pathname === '/dashboard/notifications') {
        if (userPermissions) {
            return NextResponse.next();
        }
        // Redirect if no permissions are set at all
        const redirectUrl = new URL('/?error=no-permissions', req.url);
        return NextResponse.redirect(redirectUrl);
    }
    
    // Find the required permission key for the current page.
    const requiredPermissionKey = Object.keys(pagePermissions).find(key => pathname.startsWith(key));

    if (requiredPermissionKey) {
        // If there's no permissions object, deny access.
        if (!userPermissions) {
            const redirectUrl = new URL(req.headers.get('referer') || '/dashboard', req.url);
            redirectUrl.searchParams.set('error', 'unauthorized');
            return NextResponse.redirect(redirectUrl);
        }

        const permissionKey = pagePermissions[requiredPermissionKey];
        const permissionForPage = userPermissions[permissionKey];
        
        if (!hasReadAccess(permissionForPage)) {
            const redirectUrl = new URL(req.headers.get('referer') || '/dashboard', req.url);
            redirectUrl.searchParams.set('error', 'unauthorized');
            return NextResponse.redirect(redirectUrl);
        }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
