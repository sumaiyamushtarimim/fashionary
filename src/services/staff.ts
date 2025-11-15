
import { staff, orders } from '@/lib/placeholder-data';
import { StaffMember, OrderStatus } from '@/types';

export async function getStaff(): Promise<StaffMember[]> {
    const updatedStaff = staff.map(member => {
        const createdOrders = orders.filter(o => o.createdBy === member.name);
        const confirmedOrders = orders.filter(o => o.confirmedBy === member.name);

        const statusBreakdown = { ...member.performance.statusBreakdown };
        for (const key in statusBreakdown) {
            statusBreakdown[key as OrderStatus] = 0;
        }

        [...createdOrders, ...confirmedOrders].forEach(order => {
            if (statusBreakdown[order.status] !== undefined) {
                statusBreakdown[order.status]++;
            }
        });

        return {
            ...member,
            performance: {
                ...member.performance,
                ordersCreated: createdOrders.length,
                ordersConfirmed: confirmedOrders.length,
                statusBreakdown: statusBreakdown,
            }
        };
    });
    return Promise.resolve(updatedStaff);
}

export async function getStaffMemberById(id: string): Promise<StaffMember | undefined> {
    const member = staff.find((s) => s.id === id);
    if (member) {
        // In a real app, this data would come from an API or be calculated in the backend.
        const createdOrders = orders.filter(o => o.createdBy === member.name);
        const confirmedOrders = orders.filter(o => o.confirmedBy === member.name);

        const statusBreakdown = { ...member.performance.statusBreakdown };
        for (const key in statusBreakdown) {
            statusBreakdown[key as OrderStatus] = 0;
        }

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
    return Promise.resolve(undefined);
}
