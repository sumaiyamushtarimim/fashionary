

import { orders, allStatuses } from '@/lib/placeholder-data';
import { Order, OrderStatus, OrderUpdateInput } from '@/types';
import { isWithinInterval, parseISO } from 'date-fns';

// In a real app, you'd fetch this from your API
// e.g. export async function getOrders() { const res = await fetch('/api/orders'); return res.json(); }

export type OrderSummaryStat = {
  status: OrderStatus;
  count: number;
  total: number;
};

export async function getOrderSummary(params?: { from?: string; to?: string }): Promise<OrderSummaryStat[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredOrders = orders;
    if (params?.from && params?.to) {
        const fromDate = parseISO(params.from);
        const toDate = parseISO(params.to);
        filteredOrders = orders.filter(order => {
            const orderDate = parseISO(order.date);
            return isWithinInterval(orderDate, { start: fromDate, end: toDate });
        });
    }

    const stats = allStatuses.reduce((acc, status) => {
        acc[status] = { status, count: 0, total: 0 };
        return acc;
    }, {} as Record<OrderStatus, OrderSummaryStat>);

    filteredOrders.forEach((order) => {
        if (stats[order.status]) {
            stats[order.status].count++;
            stats[order.status].total += order.total;
        }
    });

    return Promise.resolve(Object.values(stats).filter(s => s.count > 0));
}


export async function getOrders(): Promise<Order[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const sortedOrders = orders
    .filter(o => o.status !== 'Incomplete' && o.status !== 'Incomplete-Cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedOrders);
}

export async function getIncompleteOrders(): Promise<Order[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const incompleteOrders = orders
    .filter(o => o.status === 'Incomplete')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(incompleteOrders);
}


export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = orders.find((o) => o.id === id);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(order);
}

export async function getOrdersByCustomerPhone(phone: string): Promise<Order[]> {
    const customerOrders = orders.filter((o) => o.customerPhone === phone);
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(customerOrders);
}

export async function getStatuses(): Promise<OrderStatus[]> {
    return Promise.resolve(allStatuses);
}

export async function updateOrder(orderId: string, updateData: OrderUpdateInput): Promise<Order | undefined> {
    console.log(`Updating order ${orderId} with:`, updateData);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        return undefined;
    }
    
    const originalOrder = orders[orderIndex];

    // Merge the new data
    const updatedOrder = {
        ...originalOrder,
        ...updateData,
    };
    
    // Add a log entry for the change
    if (updateData.assignedToId && updateData.assignedToId !== originalOrder.assignedToId) {
        const staffName = updateData.assignedTo || 'Unassigned';
        updatedOrder.logs.push({
            title: 'Order Assigned',
            description: `Order assigned to ${staffName}.`,
            timestamp: new Date().toISOString(),
            user: 'Admin' // This would be the logged in user in a real app
        });
    }

    orders[orderIndex] = updatedOrder;

    return Promise.resolve(updatedOrder);
}


type ScanValidationResult = {
    status: 'ok' | 'error';
    order?: {
      id: string;
      currentStatus: OrderStatus;
    };
    reason?: string;
  };

export async function validateScannedOrder(code: string): Promise<ScanValidationResult> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network latency
    const order = orders.find(o => o.id === code);

    if (!order) {
        return { status: 'error', reason: 'Order not found' };
    }

    // Example of a status mismatch error
    // if (order.status !== 'RTS (Ready to Ship)') {
    //     return { status: 'error', reason: `Order status is "${order.status}", expected "RTS"`};
    // }

    return {
        status: 'ok',
        order: {
            id: order.id,
            currentStatus: order.status,
        }
    };
}


// Add other functions like createOrder, updateOrder, etc.

    