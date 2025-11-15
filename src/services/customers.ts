
import { customers, orders } from '@/lib/placeholder-data';
import { Customer, Order } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getCustomers() { const res = await fetch('/api/customers'); return res.json(); }

export async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(customers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customer = customers.find((c) => c.id === id);
  if (customer) {
    const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
    customer.totalOrders = customerOrders.length;
    customer.totalSpent = customerOrders.reduce((acc, order) => acc + order.total, 0);
  }
  return Promise.resolve(customer);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const customer = await getCustomerById(customerId);
    if (!customer) return [];
    const customerOrders = orders.filter((o) => o.customerPhone === customer.phone).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(customerOrders);
}

// Add other functions like createCustomer, updateCustomer, deleteCustomer

    