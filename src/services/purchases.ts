import { purchaseOrders } from '@/lib/placeholder-data';
import { PurchaseOrder } from '@/types';

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Promise.resolve(purchaseOrders);
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined> {
    const po = purchaseOrders.find((p) => p.id === id);
    return Promise.resolve(po);
}
