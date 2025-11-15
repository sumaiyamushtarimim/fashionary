import { inventory, inventoryMovements, stockLocations } from '@/lib/placeholder-data';
import { InventoryItem, InventoryMovement, StockLocation } from '@/types';

// In a real app, you'd fetch this from your API

export async function getInventory(): Promise<InventoryItem[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(inventory);
}

export async function getInventoryMovements(): Promise<Record<string, InventoryMovement[]>> {
    return Promise.resolve(inventoryMovements);
}

export async function getStockLocations(): Promise<StockLocation[]> {
    return Promise.resolve(stockLocations);
}

// Add other functions like updateInventory, etc.
