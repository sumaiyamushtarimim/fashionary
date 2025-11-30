
'use client'

import * as React from 'react';
import type { StaffMember, StaffRole } from '@/types';
import { useUser } from '@clerk/nextjs';

type PermissionsContextType = StaffMember['permissions'] | null;

const PermissionsContext = React.createContext<PermissionsContextType>(null);

// This provider now ONLY sets up the context.
// The data fetching is done in the server-side layout.
export function PermissionsProvider({ 
    children,
    value 
}: { 
    children: React.ReactNode,
    value: PermissionsContextType 
}) {
    return (
        <PermissionsContext.Provider value={value}>
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
