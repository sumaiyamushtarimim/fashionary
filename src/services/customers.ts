
import { customers, orders } from '@/lib/placeholder-data';
import { Customer, Order, CustomerCreateInput, CustomerUpdateInput } from '@/types';

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

export async function createCustomer(customerData: CustomerCreateInput): Promise<Customer> {
    console.log("Creating customer:", customerData);
    const newCustomer: Customer = {
        id: `CUST${(customers.length + 1).toString().padStart(3, '0')}`,
        ...customerData,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
    };
    customers.push(newCustomer);
    return Promise.resolve(newCustomer);
}

export async function updateCustomer(customerId: string, updateData: CustomerUpdateInput): Promise<Customer | undefined> {
    console.log(`Updating customer ${customerId}:`, updateData);
    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
        return Promise.resolve(undefined);
    }
    const updatedCustomer = { ...customers[customerIndex], ...updateData };
    customers[customerIndex] = updatedCustomer as Customer; // Note: In a real app, you'd re-calculate totals
    return getCustomerById(customerId); // Re-fetch to get calculated fields
}

export async function deleteCustomer(customerId: string): Promise<{ success: boolean }> {
    console.log(`Deleting customer ${customerId}`);
    const initialLength = customers.length;
    const filteredCustomers = customers.filter(c => c.id !== customerId);
    // This is a mock, so we can't truly mutate the imported array, but we simulate it
    if (filteredCustomers.length < initialLength) {
        console.log("Mock deletion successful");
        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false });
}
