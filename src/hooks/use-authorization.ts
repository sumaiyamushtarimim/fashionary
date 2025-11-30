

'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { StaffMember } from '@/types';
import { usePermissions } from './use-permissions';

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

export function useAuthorization() {
  const pathname = usePathname();
  const permissions = usePermissions();
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (permissions === null) {
      // Permissions not yet loaded
      setIsChecking(true);
      return;
    }

    // Default to authorized for the main dashboard page
    if (pathname === '/dashboard') {
        setIsAuthorized(true);
        setIsChecking(false);
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
        
        setIsAuthorized(hasAccess);
    } else {
        // If route is not in the permission map, allow access by default
        setIsAuthorized(true);
    }
    
    setIsChecking(false);

  }, [pathname, permissions]);

  return { isAuthorized, isChecking };
}
