

import { staff, orders } from '@/lib/placeholder-data';
import { StaffMember, OrderStatus } from '@/types';

export async function getStaff(): Promise<StaffMember[]> {
    // This is a simplified version. In a real app, performance data would be calculated on the backend.
    return Promise.resolve(staff);
}

export async function getStaffMemberById(id: string): Promise<StaffMember | undefined> {
    const member = staff.find((s) => s.id === id);
    if (!member) return Promise.resolve(undefined);

    // In a real app, this data would come from an API or be calculated in the backend.
    // For mock purposes, we recalculate some stats here.
    const createdOrders = orders.filter(o => o.createdBy === member.name);
    const confirmedOrders = orders.filter(o => o.confirmedBy === member.name);

    const statusBreakdown: Record<OrderStatus, number> = {
        'New': 0, 'Confirmed': 0, 'Packing Hold': 0, 'Canceled': 0, 'Hold': 0, 
        'In-Courier': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 
        'Returned': 0, 'Return Pending': 0, 'Paid Returned': 0, 'Partial': 0, 'Incomplete': 0, 'Incomplete-Cancelled': 0
    };

    [...createdOrders, ...confirmedOrders].forEach(order => {
        if (statusBreakdown[order.status] !== undefined) {
            statusBreakdown[order.status]++;
        }
    });

    const updatedMember = {
        ...member,
        performance: {
            ...member.performance,
            ordersCreated: createdOrders.length,
            ordersConfirmed: confirmedOrders.length,
            statusBreakdown: statusBreakdown,
        }
    };
    return Promise.resolve(updatedMember);
}

    