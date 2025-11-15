import { wooCommerceIntegrations } from '@/lib/placeholder-data';
import { WooCommerceIntegration } from '@/types';

export async function getWooCommerceIntegrations(): Promise<WooCommerceIntegration[]> {
    return Promise.resolve(wooCommerceIntegrations);
}
