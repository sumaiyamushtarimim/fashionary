
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { getOrderById } from '@/services/orders';
import type { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Logo } from '@/components/logo';
import Barcode from 'react-barcode';

export function StickerTemplate({ order }: { order: Order }) {
    const total = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0) + 5.00 + (order.products.reduce((acc, p) => acc + p.price * p.quantity, 0) * 0.08);

    return (
        <div className="bg-white p-4 border" style={{ width: '75mm', height: '100mm' }}>
            <div className="h-full flex flex-col justify-between text-[10px]">
                {/* Header */}
                <header className="flex justify-between items-start pb-2 border-b">
                    <div>
                        <p className="font-bold text-sm">FROM: Fashionary</p>
                        <p>123 Fashion Ave, Dhaka</p>
                        <p>Phone: +8801234567890</p>
                    </div>
                    <div className="w-12 h-12">
                        <Logo />
                    </div>
                </header>

                {/* To Section */}
                <section className="my-2">
                    <p className="font-bold text-sm">TO: {order.customerName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p className="font-bold">{order.customerPhone}</p>
                </section>

                {/* Barcode and Details */}
                <section className="flex-grow flex flex-col justify-center items-center my-2">
                    <div className="w-full text-center">
                       <Barcode value={order.id} height={40} width={1.5} fontSize={12} margin={0} />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-2 mt-2 text-center">
                        <div>
                            <p className="font-bold">COD Amount:</p>
                            <p className="text-lg font-bold">৳{(total - order.paidAmount).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="font-bold">Invoice #:</p>
                            <p className="text-lg font-bold">{order.id}</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center pt-2 border-t">
                    <p className="font-bold">Thank you for your order!</p>
                    <p>Order Date: {format(new Date(order.date), 'dd MMM, yyyy')}</p>
                </footer>
            </div>
        </div>
    );
}

export default function SingleStickerPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = React.useState<Order | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (orderId) {
            getOrderById(orderId).then(data => {
                if (data) {
                    setOrder(data);
                }
                setIsLoading(false);
            });
        }
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="p-10 flex justify-center items-center bg-gray-100 min-h-screen">
                <Skeleton className="w-[75mm] h-[100mm]" />
            </div>
        );
    }
    
    if (!order) {
        return <div className="p-10 text-center">Order not found.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">
            <div className="p-4 bg-white shadow-md no-print sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-lg font-bold">Sticker Preview</h1>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Sticker
                </Button>
            </div>
             <div className="p-10 flex justify-center items-start print:p-0">
                <StickerTemplate order={order} />
            </div>
        </div>
    );
}
