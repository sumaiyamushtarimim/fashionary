
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { StaffMember, StaffRole, Permission } from './types';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Permission presets for each role
const NO_ACCESS: Permission = { create: false, read: false, update: false, delete: false };
const READ_ONLY: Permission = { create: false, read: true, update: false, delete: false };
const CREATE_READ_UPDATE: Permission = { create: true, read: true, update: true, delete: false };
const FULL_ACCESS: Permission = { create: true, read: true, update: true, delete: true };

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
    'Vendor/Supplier': {
        orders: NO_ACCESS, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: { create: false, read: true, update: true, delete: false }, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: NO_ACCESS, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Custom': NO_ACCESS,
};

// Map routes to the required permission key
const ROUTE_PERMISSIONS: Record<string, keyof StaffMember['permissions']> = {
  '/dashboard/orders': 'orders',
  '/dashboard/issues': 'issues',
  '/dashboard/packing-orders': 'packingOrders',
  '/dashboard/courier-report': 'courierReport',
  '/dashboard/products': 'products',
  '/dashboard/inventory': 'inventory',
  '/dashboard/customers': 'customers',
  '/dashboard/purchases': 'purchases',
  '/dashboard/expenses': 'expenses',
  '/dashboard/check-passing': 'checkPassing',
  '/dashboard/partners': 'partners',
  '/dashboard/analytics': 'analytics',
  '/dashboard/accounting': 'accounting',
  '/dashboard/staff': 'staff',
  '/dashboard/attendance': 'attendance',
  '/dashboard/settings': 'settings',
};

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionClaims } = auth();

    // If the user isn't logged in, Clerk will automatically redirect them.
    if (!sessionClaims) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    const role = sessionClaims.publicMetadata?.role as StaffRole | undefined;
    const customPermissions = sessionClaims.publicMetadata?.permissions as StaffMember['permissions'] | undefined;
    
    let userPermissions: StaffMember['permissions'] | undefined;
    
    if (role && PERMISSIONS[role]) {
        userPermissions = PERMISSIONS[role];
    } else if (customPermissions) {
        userPermissions = customPermissions;
    }

    if (!userPermissions) {
       const unauthorizedUrl = new URL(req.nextUrl.origin);
       unauthorizedUrl.searchParams.set('error', 'unauthorized');
       return NextResponse.redirect(unauthorizedUrl);
    }
    
    const path = req.nextUrl.pathname;
    const routePermissionKey = Object.keys(ROUTE_PERMISSIONS).find(p => path.startsWith(p));
    
    if (routePermissionKey) {
        const permissionKey = ROUTE_PERMISSIONS[routePermissionKey];
        const permission = userPermissions[permissionKey];

        if (typeof permission === 'boolean' && !permission) {
             const unauthorizedUrl = new URL(req.nextUrl.origin);
             unauthorizedUrl.searchParams.set('error', 'unauthorized');
             return NextResponse.redirect(unauthorizedUrl);
        }
        if (typeof permission === 'object' && !permission.read) {
             const unauthorizedUrl = new URL(req.nextUrl.origin);
             unauthorizedUrl.searchParams.set('error', 'unauthorized');
             return NextResponse.redirect(unauthorizedUrl);
        }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
