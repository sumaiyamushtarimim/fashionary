import { customers } from '@/lib/placeholder-data';
import { Customer } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getCustomers() { const res = await fetch('/api/customers'); return res.json(); }

export async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(customers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customer = customers.find((c) => c.id === id);
  return Promise.resolve(customer);
}

// Add other functions like createCustomer, updateCustomer, deleteCustomer
