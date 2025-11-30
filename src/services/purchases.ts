

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

    const originalOrder = purchaseOrders[poIndex];

    // Deep merge for nested payment objects
    const updatedOrder = {
        ...originalOrder,
        ...updates,
        fabricPayment: updates.fabricPayment ? { ...originalOrder.fabricPayment, ...updates.fabricPayment } : originalOrder.fabricPayment,
        printingPayment: updates.printingPayment ? { ...originalOrder.printingPayment, ...updates.printingPayment } : originalOrder.printingPayment,
        cuttingPayment: updates.cuttingPayment ? { ...originalOrder.cuttingPayment, ...updates.cuttingPayment } : originalOrder.cuttingPayment,
    };
    
    purchaseOrders[poIndex] = updatedOrder;
    
    // In a real app, this would be a single API call. Here we simulate it.
    console.log("Updated PO in mock data:", updatedOrder);

    return Promise.resolve(updatedOrder);
}
