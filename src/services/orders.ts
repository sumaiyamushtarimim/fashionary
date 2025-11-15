import { orders } from '@/lib/placeholder-data';
import { Order } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getOrders() { const res = await fetch('/api/orders'); return res.json(); }

export async function getOrders(): Promise<Order[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(orders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = orders.find((o) => o.id === id);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(order);
}

export async function getOrdersByCustomer(customerName: string): Promise<Order[]> {
    const customerOrders = orders.filter((o) => o.customerName === customerName).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(customerOrders);
}

// Add other functions like createOrder, updateOrder, etc.
