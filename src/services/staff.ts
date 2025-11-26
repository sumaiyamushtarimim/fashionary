

import { staff, orders } from '@/lib/placeholder-data';
import { StaffMember, OrderStatus, Order } from '@/types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval } from 'date-fns';

function getPeriod(period: 'Daily' | 'Weekly' | 'Monthly'): { start: Date, end: Date } {
    const now = new Date();
    switch (period) {
        case 'Daily':
            return { start: startOfDay(now), end: endOfDay(now) };
        case 'Weekly':
            return { start: startOfWeek(now), end: endOfWeek(now) };
        case 'Monthly':
        default:
            return { start: startOfMonth(now), end: endOfMonth(now) };
    }
}

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

    // Recalculate income history based on commission targets
    let incomeHistory = [...member.incomeHistory]; // Start with existing history for non-target scenarios
    if (member.commissionDetails?.targetEnabled && member.commissionDetails.targetPeriod && member.commissionDetails.targetCount) {
        const { start, end } = getPeriod(member.commissionDetails.targetPeriod);
        
        const ordersInPeriod = orders.filter(o => {
            const orderDate = new Date(o.date);
            return (o.createdBy === member.name || o.confirmedBy === member.name) && isWithinInterval(orderDate, { start, end });
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        incomeHistory = [];
        let orderCount = 0;
        
        ordersInPeriod.forEach(order => {
            orderCount++;
            if (orderCount > member.commissionDetails!.targetCount!) {
                if(order.createdBy === member.name) {
                    incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Created',
                        amount: member.commissionDetails!.onOrderCreate
                    });
                }
                if(order.confirmedBy === member.name) {
                     incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Confirmed',
                        amount: member.commissionDetails!.onOrderConfirm
                    });
                }
            }
        });
    }


    const statusBreakdown: Record<OrderStatus, number> = {
        'New': 0, 'Confirmed': 0, 'Packing Hold': 0, 'Canceled': 0, 'Hold': 0, 
        'In-Courier': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 
        'Returned': 0, 'Return Pending': 0, 'Partial': 0, 'Incomplete': 0, 'Incomplete-Cancelled': 0
    };

    [...createdOrders, ...confirmedOrders].forEach(order => {
        if (statusBreakdown[order.status] !== undefined) {
            statusBreakdown[order.status]++;
        }
    });

    const totalEarned = incomeHistory.reduce((acc, item) => acc + item.amount, 0) + (member.salaryDetails?.amount || 0);

    const updatedMember = {
        ...member,
        performance: {
            ...member.performance,
            ordersCreated: createdOrders.length,
            ordersConfirmed: confirmedOrders.length,
            statusBreakdown: statusBreakdown,
        },
        incomeHistory: incomeHistory,
        financials: {
            ...member.financials,
            totalEarned: totalEarned,
            dueAmount: totalEarned - member.financials.totalPaid,
        }
    };
    return Promise.resolve(updatedMember);
}

    
