
import { purchaseOrders } from '@/lib/placeholder-data';
import { PurchaseOrder, Payment } from '@/types';

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Promise.resolve(purchaseOrders);
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined> {
    const po = purchaseOrders.find((p) => p.id === id);
    return Promise.resolve(po);
}

export async function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder | undefined> {
    console.log(`Updating PO ${id} with:`, updates);
    const poIndex = purchaseOrders.findIndex(p => p.id === id);
    if (poIndex === -1) {
        return undefined;
    }

    const updatedPO = {
        ...purchaseOrders[poIndex],
        ...updates
    };

    purchaseOrders[poIndex] = updatedPO;
    
    // In a real app, this would be a single API call. Here we simulate it.
    console.log("Updated PO in mock data:", updatedPO);

    return Promise.resolve(updatedPO);
}
