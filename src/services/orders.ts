

import { orders, allStatuses } from '@/lib/placeholder-data';
import { Order, OrderStatus } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getOrders() { const res = await fetch('/api/orders'); return res.json(); }

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
    return Promise.resolve(customerOrders);
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
    const customerOrders = orders.filter(o => o.customerPhone === phone);
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(customerOrders);
}

export async function getStatuses(): Promise<OrderStatus[]> {
    return Promise.resolve(allStatuses);
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

    
