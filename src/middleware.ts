
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { Permission, StaffRole, StaffMember } from '@/types';

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

// Maps dashboard pages to the required permissions
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
    '/dashboard/staff': 'staff',
    '/dashboard/settings': 'settings',
};

const hasAccess = (permission: Permission | boolean | undefined): boolean => {
    if (typeof permission === 'boolean') return permission;
    if (typeof permission === 'object' && permission !== null) return permission.read;
    return false;
}

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();
  const pathname = req.nextUrl.pathname;

  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    if (!userId) {
      return redirectToSignIn();
    }
    
    const { publicMetadata } = sessionClaims || {};
    const role = (publicMetadata as any)?.role as StaffRole | undefined;
    const permissions = (publicMetadata as any)?.permissions as StaffMember['permissions'] | undefined;

    // Default to the dashboard if no specific permissions are needed for the page
    if (pathname === '/dashboard' || pathname === '/dashboard/account' || pathname === '/dashboard/notifications') {
        return;
    }

    const requiredPermissionKey = Object.keys(pagePermissions).find(key => pathname.startsWith(key));

    if (requiredPermissionKey) {
        const permissionKey = pagePermissions[requiredPermissionKey];
        const userPermission = permissions ? permissions[permissionKey] : undefined;
        
        if (!hasAccess(userPermission)) {
            // Find the first accessible page for the user to redirect them.
            const firstAccessiblePage = Object.keys(pagePermissions).find(key => {
                const pKey = pagePermissions[key];
                return permissions && hasAccess(permissions[pKey]);
            });
            
            // Redirect to the first accessible page or dashboard if none found.
            const redirectUrl = firstAccessiblePage ? new URL(firstAccessiblePage, req.url) : new URL('/dashboard', req.url);
            return NextResponse.redirect(redirectUrl);
        }
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
