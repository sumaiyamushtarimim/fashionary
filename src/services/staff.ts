
import { staff, orders } from '@/lib/placeholder-data';
import { StaffMember, OrderStatus, Order, StaffPayment } from '@/types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval, format } from 'date-fns';

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
    // Mocking packed orders. In a real app, this would be tracked properly.
    const packedOrders = orders.filter(o => o.status === 'RTS (Ready to Ship)' || o.status === 'Shipped' || o.status === 'Delivered');

    // Recalculate income history based on commission targets
    let incomeHistory: StaffMember['incomeHistory'] = []; 
    
    if (member.commissionDetails?.targetEnabled && member.commissionDetails.targetPeriod && member.commissionDetails.targetCount) {
        const { start, end } = getPeriod(member.commissionDetails.targetPeriod);
        
        let relevantOrders: Order[] = [];
        let orderCount = 0;

        if(member.role === 'Packing Assistant') {
            relevantOrders = packedOrders.filter(o => {
                const orderDate = new Date(o.date); // Assuming packing date is close to order date for mock
                return isWithinInterval(orderDate, { start, end });
            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            orderCount = relevantOrders.length;
        } else {
             const ordersInPeriod = orders.filter(o => {
                const orderDate = new Date(o.date);
                return (o.createdBy === member.name || o.confirmedBy === member.name) && isWithinInterval(orderDate, { start, end });
            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            orderCount = ordersInPeriod.length;
            relevantOrders = ordersInPeriod;
        }
        
        let processedOrderCount = 0;
        relevantOrders.forEach(order => {
            processedOrderCount++;
            if (processedOrderCount > member.commissionDetails!.targetCount!) {
                 if (member.role === 'Packing Assistant' && member.commissionDetails?.onOrderPacked) {
                     incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Packed',
                        amount: member.commissionDetails.onOrderPacked
                    });
                } else {
                    if(order.createdBy === member.name && member.commissionDetails?.onOrderCreate) {
                        incomeHistory.push({
                            date: order.date,
                            orderId: order.id,
                            action: 'Created',
                            amount: member.commissionDetails.onOrderCreate
                        });
                    }
                    if(order.confirmedBy === member.name && member.commissionDetails?.onOrderConfirm) {
                         incomeHistory.push({
                            date: order.date,
                            orderId: order.id,
                            action: 'Confirmed',
                            amount: member.commissionDetails.onOrderConfirm
                        });
                    }
                }
            }
        });

    } else { // Handle non-target based commission
         orders.forEach(order => {
            if (member.role === 'Packing Assistant' && member.commissionDetails?.onOrderPacked) {
                // Mock logic: assume this staff packed the order
                if (packedOrders.some(p => p.id === order.id)) {
                    incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Packed',
                        amount: member.commissionDetails.onOrderPacked
                    });
                }
            } else {
                if (order.createdBy === member.name && member.commissionDetails?.onOrderCreate) {
                    incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Created',
                        amount: member.commissionDetails.onOrderCreate
                    });
                }
                if (order.confirmedBy === member.name && member.commissionDetails?.onOrderConfirm) {
                    incomeHistory.push({
                        date: order.date,
                        orderId: order.id,
                        action: 'Confirmed',
                        amount: member.commissionDetails.onOrderConfirm
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
    
    // For packing assistants, their performance is packing, not creating/confirming
    if (member.role === 'Packing Assistant') {
        statusBreakdown['RTS (Ready to Ship)'] = packedOrders.length;
    }


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

export async function makePayment(staffId: string, amount: number, notes: string): Promise<StaffMember | undefined> {
    const memberIndex = staff.findIndex(s => s.id === staffId);
    if (memberIndex === -1) {
        return Promise.resolve(undefined);
    }

    const member = staff[memberIndex];
    const newPayment: StaffPayment = {
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: amount,
        notes: notes
    };

    member.paymentHistory.unshift(newPayment);
    member.financials.totalPaid += amount;
    member.financials.dueAmount -= amount;

    staff[memberIndex] = member;

    return getStaffMemberById(staffId);
}
    

    

