
'use client'

import * as React from 'react';
import type { StaffMember } from '@/types';
import { useUser } from '@clerk/nextjs';

type PermissionsContextType = StaffMember['permissions'] | null;

const PermissionsContext = React.createContext<PermissionsContextType>(null);

export function PermissionsProvider({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    const { user } = useUser();
    const [permissions, setPermissions] = React.useState<PermissionsContextType>(null);
    
    React.useEffect(() => {
        if (user && user.publicMetadata) {
            if (user.publicMetadata.permissions) {
                setPermissions(user.publicMetadata.permissions as StaffMember['permissions']);
            }
        }
    }, [user]);

    return (
        <PermissionsContext.Provider value={permissions}>
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = React.useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
}
