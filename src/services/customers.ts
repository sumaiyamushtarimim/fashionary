
import { customers, orders } from '@/lib/placeholder-data';
import { Customer, Order } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getCustomers() { const res = await fetch('/api/customers'); return res.json(); }

export async function getCustomers(): Promise<Customer[]> {
  const customerData = customers.map(c => {
    const customerOrders = orders.filter(o => o.customerPhone === c.phone);
    return {
      ...c,
      totalOrders: customerOrders.length,
      totalSpent: customerOrders.reduce((acc, order) => acc + order.total, 0),
    }
  });
  return Promise.resolve(customerData);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customer = customers.find((c) => c.id === id || c.phone === id);
  if (customer) {
    const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
    return Promise.resolve({
        ...customer,
        totalOrders: customerOrders.length,
        totalSpent: customerOrders.reduce((acc, order) => acc + order.total, 0)
    });
  }
  return Promise.resolve(undefined);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const customer = await getCustomerById(customerId);
    if (!customer) return [];
    const customerOrders = orders.filter((o) => o.customerPhone === customer.phone).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(customerOrders);
}

// Add other functions like createCustomer, updateCustomer, deleteCustomer

    