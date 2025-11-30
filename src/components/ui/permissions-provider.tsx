
'use client'

import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import type { StaffMember, StaffRole } from '@/types';
import { useUser } from '@clerk/nextjs';

// This is the shape of the data that will be available in the context.
type PermissionsContextType = StaffMember['permissions'] | null;

// The actual context object.
const PermissionsContext = React.createContext<PermissionsContextType>(null);

// The provider component. It now takes `value` as a prop.
export function PermissionsProvider({ 
    children,
    value 
}: { 
    children: React.ReactNode,
    value?: PermissionsContextType 
}) {
    const { user } = useUser();
    // This state will hold the permissions, either passed from the server
    // or fetched on the client side if needed (though we aim to avoid this).
    const [permissions, setPermissions] = React.useState<PermissionsContextType>(value || null);
    
    React.useEffect(() => {
        if (user && user.publicMetadata?.permissions) {
             setPermissions(user.publicMetadata.permissions as StaffMember['permissions']);
        } else if (value) {
            setPermissions(value);
        }
    }, [user, value]);

    return (
        <PermissionsContext.Provider value={permissions}>
            {children}
        </PermissionsContext.Provider>
    );
}

// The hook to consume the permissions.
export function usePermissions() {
    const context = React.useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
}
