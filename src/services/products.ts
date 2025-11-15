import { products, categories } from '@/lib/placeholder-data';
import { Product, Category } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getProducts() { const res = await fetch('/api/products'); return res.json(); }

export async function getProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = products.find((p) => p.id === id);
  return Promise.resolve(product);
}

export async function getCategories(): Promise<Category[]> {
    return Promise.resolve(categories);
}
