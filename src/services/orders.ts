
import { orders, allStatuses } from '@/lib/placeholder-data';
import { Order, OrderStatus } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getOrders() { const res = await fetch('/api/orders'); return res.json(); }

export async function getOrders(): Promise<Order[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedOrders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = orders.find((o) => o.id === id);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(order);
}

export async function getOrdersByCustomer(customerPhone: string): Promise<Order[]> {
    const customerOrders = orders.filter((o) => o.customerPhone === customerPhone).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(customerOrders);
}

export async function getStatuses(): Promise<OrderStatus[]> {
    return Promise.resolve(allStatuses);
}

// Add other functions like createOrder, updateOrder, etc.

    