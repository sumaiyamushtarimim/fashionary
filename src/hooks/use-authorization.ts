
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { StaffMember } from '@/types';

const ROUTE_PERMISSIONS: Record<string, keyof StaffMember['permissions']> = {
    '/dashboard/staff': 'staff',
    '/dashboard/settings': 'settings',
    '/dashboard/analytics': 'analytics',
    '/dashboard/products': 'products',
    '/dashboard/orders': 'orders',
    '/dashboard/customers': 'customers',
    '/dashboard/inventory': 'inventory',
    '/dashboard/purchases': 'purchases',
    '/dashboard/expenses': 'expenses',
    '/dashboard/check-passing': 'checkPassing',
    '/dashboard/partners': 'partners',
    '/dashboard/courier-report': 'courierReport',
    '/dashboard/packing-orders': 'packingOrders',
    '/dashboard/issues': 'issues',
    '/dashboard/attendance': 'attendance',
    '/dashboard/accounting': 'accounting',
};

export function useAuthorization(permissions: StaffMember['permissions'] | null) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (permissions === null) {
      // Permissions are not yet loaded, do nothing.
      return;
    }

    const requiredPermissionKey = Object.keys(ROUTE_PERMISSIONS).find(
      (key) => pathname.startsWith(key)
    );

    if (requiredPermissionKey) {
        const permission = permissions[ROUTE_PERMISSIONS[requiredPermissionKey]];
        
        let hasAccess = false;
        if (typeof permission === 'boolean') {
            hasAccess = permission;
        } else if (permission) {
            hasAccess = permission.read;
        }
        
        if (!hasAccess) {
            // Redirect to a specific page and show an unauthorized message
            router.replace('/dashboard?error=unauthorized');
        }
    }
    
  }, [pathname, permissions, router]);
}
