
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById } from '@/services/orders';
import type { Order } from '@/types';
import { InvoiceTemplate } from '../invoice/[id]/page';
import { StickerTemplate } from '../sticker/[id]/page';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function BulkPrintPage() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const printType = searchParams.get('type');
    const orderIds = searchParams.get('ids')?.split(',') || [];

    React.useEffect(() => {
        setIsLoading(true);
        const fetchOrders = async () => {
            const fetchedOrders = await Promise.all(
                orderIds.map(id => getOrderById(id))
            );
            setOrders(fetchedOrders.filter((o): o is Order => !!o));
            setIsLoading(false);
        };

        if (orderIds.length > 0) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    if (isLoading) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return <div className="p-10 text-center">No orders to print.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4 bg-white shadow-md no-print sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-lg font-bold">
                    Bulk Print: {orders.length} {printType === 'invoice' ? 'Invoices' : 'Stickers'}
                </h1>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print All
                </Button>
            </div>

            <div className="p-4 print:p-0">
                {printType === 'invoice' && (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white shadow-lg print:shadow-none page-break">
                                <InvoiceTemplate order={order} />
                            </div>
                        ))}
                    </div>
                )}

                {printType === 'sticker' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-0">
                         {orders.map(order => (
                            <div key={order.id} className="flex justify-center items-start page-break">
                                <StickerTemplate order={order} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
             <style jsx global>{`
                @media print {
                    .page-break {
                        page-break-inside: avoid;
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
}
