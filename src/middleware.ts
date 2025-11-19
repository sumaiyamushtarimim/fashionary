
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
    if (permission === undefined) return false;
    if (typeof permission === 'boolean') return permission;
    if (typeof permission === 'object' && permission !== null) return permission.read;
    return false;
}

// --- PERMISSIONS PRESETS for mocking in development ---
const NO_ACCESS: Permission = { create: false, read: false, update: false, delete: false };
const READ_ONLY: Permission = { create: false, read: true, update: false, delete: false };
const CREATE_READ_UPDATE: Permission = { create: true, read: true, update: true, delete: false };
const FULL_ACCESS: Permission = { create: true, read: true, update: true, delete: true };

const PERMISSIONS = {
    Admin: {
        orders: FULL_ACCESS, packingOrders: FULL_ACCESS, products: FULL_ACCESS, inventory: FULL_ACCESS,
        customers: FULL_ACCESS, purchases: FULL_ACCESS, expenses: FULL_ACCESS, checkPassing: FULL_ACCESS,
        partners: FULL_ACCESS, courierReport: FULL_ACCESS, staff: FULL_ACCESS, settings: FULL_ACCESS, analytics: FULL_ACCESS,
    },
    Manager: {
        orders: CREATE_READ_UPDATE, packingOrders: READ_ONLY, products: CREATE_READ_UPDATE, inventory: CREATE_READ_UPDATE,
        customers: CREATE_READ_UPDATE, purchases: CREATE_READ_UPDATE, expenses: CREATE_READ_UPDATE, checkPassing: { ...CREATE_READ_UPDATE, create: false },
        partners: CREATE_READ_UPDATE, courierReport: READ_ONLY, staff: { ...CREATE_READ_UPDATE, delete: false }, settings: READ_ONLY, analytics: NO_ACCESS,
    },
    Moderator: {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
    },
    'Packing Assistant': {
        orders: NO_ACCESS, packingOrders: { ...CREATE_READ_UPDATE, create: false, delete: false }, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
    }
};
// --- END OF PERMISSIONS PRESETS ---


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
    let role = (publicMetadata as any)?.role as StaffRole | undefined;
    let permissions = (publicMetadata as any)?.permissions as StaffMember['permissions'] | undefined;

    // --- Development Role-Switching Logic ---
    if (process.env.NODE_ENV === 'development') {
        const mockRole = req.cookies.get('mock_role')?.value as StaffRole | undefined;
        if (mockRole && PERMISSIONS[mockRole]) {
            role = mockRole;
            permissions = PERMISSIONS[mockRole] as StaffMember['permissions'];
        }
    }
    // --- End of Development Logic ---
    
    // If no role or permissions, only allow dashboard access
    if (!role || !permissions) {
        if (pathname !== '/dashboard' && pathname !== '/dashboard/account' && pathname !== '/dashboard/notifications') {
            const redirectUrl = new URL('/dashboard', req.url);
            return NextResponse.redirect(redirectUrl);
        }
        return;
    }

    // Default to the dashboard if no specific permissions are needed for the page
    if (pathname === '/dashboard' || pathname === '/dashboard/account' || pathname === '/dashboard/notifications') {
        return;
    }

    const requiredPermissionKey = Object.keys(pagePermissions).find(key => pathname.startsWith(key));

    if (requiredPermissionKey) {
        const permissionKey = pagePermissions[requiredPermissionKey];
        const userPermission = permissions[permissionKey];
        
        if (!hasAccess(userPermission)) {
            // Find the first accessible page for the user to redirect them.
            const firstAccessiblePage = Object.keys(pagePermissions).find(key => {
                const pKey = pagePermissions[key];
                return hasAccess(permissions[pKey]);
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
