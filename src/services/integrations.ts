import { wooCommerceIntegrations, courierIntegrations, courierServices } from '@/lib/placeholder-data';
import { WooCommerceIntegration, CourierIntegration, CourierService } from '@/types';

export async function getWooCommerceIntegrations(): Promise<WooCommerceIntegration[]> {
    return Promise.resolve(wooCommerceIntegrations);
}

export async function getCourierIntegrations(): Promise<CourierIntegration[]> {
    return Promise.resolve(courierIntegrations);
}

export async function getCourierServices(): Promise<CourierService[]> {
    return Promise.resolve(courierServices);
}
