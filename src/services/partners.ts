import { suppliers, vendors, purchaseOrders } from '@/lib/placeholder-data';
import { Supplier, Vendor, PurchaseOrder } from '@/types';

type Partner = Supplier | Vendor;

export async function getPartners(): Promise<Partner[]> {
    const allPartners: Partner[] = [...suppliers, ...vendors];
    return Promise.resolve(allPartners);
}

export async function getPartnerById(id: string): Promise<Partner | undefined> {
    const partner = [...suppliers, ...vendors].find((p) => p.id === id);
    return Promise.resolve(partner);
}

export async function getPurchaseOrdersByPartner(partnerName: string): Promise<PurchaseOrder[]> {
    const partnerPOs = purchaseOrders.filter(po => 
        po.supplier === partnerName || 
        po.printingVendor === partnerName || 
        po.cuttingVendor === partnerName
    );
    return Promise.resolve(partnerPOs);
}

export async function getSuppliers(): Promise<Supplier[]> {
    return Promise.resolve(suppliers);
}

export async function getVendors(): Promise<Vendor[]> {
    return Promise.resolve(vendors);
}
