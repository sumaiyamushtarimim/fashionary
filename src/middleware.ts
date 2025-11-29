

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
    '/dashboard/orders/all': 'orders',
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
const FULL_ACCESS: Permission = { create: true, read: true, update: true, delete: false };

const PERMISSIONS: Record<StaffRole, StaffMember['permissions']> = {
    Admin: {
        orders: FULL_ACCESS, packingOrders: FULL_ACCESS, products: FULL_ACCESS, inventory: FULL_ACCESS,
        customers: FULL_ACCESS, purchases: FULL_ACCESS, expenses: FULL_ACCESS, checkPassing: FULL_ACCESS,
        partners: FULL_ACCESS, courierReport: FULL_ACCESS, staff: FULL_ACCESS, settings: FULL_ACCESS, analytics: FULL_ACCESS,
        issues: FULL_ACCESS, attendance: FULL_ACCESS, accounting: FULL_ACCESS,
    },
    Manager: {
        orders: CREATE_READ_UPDATE, packingOrders: READ_ONLY, products: CREATE_READ_UPDATE, inventory: CREATE_READ_UPDATE,
        customers: CREATE_READ_UPDATE, purchases: CREATE_READ_UPDATE, expenses: CREATE_READ_UPDATE, checkPassing: { ...CREATE_READ_UPDATE, create: false },
        partners: CREATE_READ_UPDATE, courierReport: READ_ONLY, staff: { ...CREATE_READ_UPDATE, delete: false }, settings: READ_ONLY, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY, accounting: READ_ONLY,
    },
    Moderator: {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Packing Assistant': {
        orders: NO_ACCESS, packingOrders: { ...CREATE_READ_UPDATE, create: false, delete: false }, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: NO_ACCESS, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Seller': {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: CREATE_READ_UPDATE, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Call Centre Manager': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: READ_ONLY, settings: NO_ACCESS, analytics: READ_ONLY,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY, accounting: READ_ONLY,
    },
    'Courier Manager': {
        orders: { ...CREATE_READ_UPDATE, create: false, delete: false }, packingOrders: READ_ONLY, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: READ_ONLY,
        partners: NO_ACCESS, courierReport: FULL_ACCESS, staff: NO_ACCESS, settings: { ...NO_ACCESS, read: true }, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Courier Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Custom': NO_ACCESS,
};
// --- END OF PERMISSIONS PRESETS ---


export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();
  const pathname = req.nextUrl.pathname;

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    let role: StaffRole | undefined;
    let permissions: StaffMember['permissions'] | undefined;

    // --- Development Role-Switching Logic ---
    if (process.env.NODE_ENV === 'development') {
        const mockRole = req.cookies.get('mock_role')?.value as StaffRole | undefined;
        if (mockRole && PERMISSIONS[mockRole]) {
            role = mockRole;
            permissions = PERMISSIONS[mockRole];
        }
    }
    
    // If not in dev mode or no mock role is set, use Clerk's session claims
    if (!permissions) {
        role = auth().sessionClaims?.publicMetadata?.role as StaffRole | undefined;
        permissions = auth().sessionClaims?.publicMetadata?.permissions as StaffMember['permissions'] | undefined;
    }
    
    // If no role or permissions, only allow dashboard access
    if (!role || !permissions) {
        if (pathname !== '/dashboard' && pathname !== '/dashboard/account' && pathname !== '/dashboard/notifications') {
            const redirectUrl = new URL('/dashboard?error=unauthorized', req.url);
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    // Default dashboard and account pages are accessible to all logged-in users
    if (pathname === '/dashboard' || pathname === '/dashboard/account' || pathname === '/dashboard/notifications') {
        return NextResponse.next();
    }

    const requiredPermissionKey = Object.keys(pagePermissions).find(key => pathname.startsWith(key));

    if (requiredPermissionKey) {
        const permissionKey = pagePermissions[requiredPermissionKey];
        const userPermission = permissions[permissionKey];
        
        if (!hasAccess(userPermission)) {
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
