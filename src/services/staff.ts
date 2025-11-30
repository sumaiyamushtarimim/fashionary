
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

const calculateStaffMemberDetails = (member: StaffMember): StaffMember => {
    const createdOrders = orders.filter(o => o.createdBy === member.name);
    const confirmedOrders = orders.filter(o => o.confirmedBy === member.name);
    const packedOrders = orders.filter(o => o.status === 'RTS (Ready to Ship)' || o.status === 'Shipped' || o.status === 'Delivered');

    let incomeHistory: StaffMember['incomeHistory'] = []; 
    
    if (member.commissionDetails?.targetEnabled && member.commissionDetails.targetPeriod && member.commissionDetails.targetCount) {
        const { start, end } = getPeriod(member.commissionDetails.targetPeriod);
        
        let relevantOrders: Order[] = [];
        let orderCount = 0;

        if(member.role === 'Packing Assistant') {
            relevantOrders = packedOrders.filter(o => {
                const orderDate = new Date(o.date);
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

    } else { 
         orders.forEach(order => {
            if (member.role === 'Packing Assistant' && member.commissionDetails?.onOrderPacked) {
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
    
    if (member.role === 'Packing Assistant') {
        statusBreakdown['RTS (Ready to Ship)'] = packedOrders.length;
    }
    
    const salary = member.paymentType === 'Salary' || member.paymentType === 'Both' ? member.salaryDetails?.amount || 0 : 0;
    const totalCommission = incomeHistory.reduce((acc, item) => acc + item.amount, 0);
    const totalEarned = salary + totalCommission;
    const totalPaid = member.paymentHistory.reduce((acc, p) => acc + p.amount, 0);

    return {
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
            totalPaid: totalPaid,
            dueAmount: totalEarned - totalPaid,
        }
    };
};

export async function getStaff(): Promise<StaffMember[]> {
  const calculatedStaff = staff.map(member => calculateStaffMemberDetails(member));
  return Promise.resolve(calculatedStaff);
}

export async function getStaffMemberById(id: string): Promise<StaffMember | undefined> {
    const member = staff.find((s) => s.id === id);
    if (!member) return Promise.resolve(undefined);
    
    const updatedMember = calculateStaffMemberDetails(member);
    return Promise.resolve(updatedMember);
}

export async function makePayment(staffId: string, amount: number, notes: string): Promise<StaffMember | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
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
    // Financials will be recalculated by getStaffMemberById
    staff[memberIndex] = member;

    return getStaffMemberById(staffId);
}
    

    

