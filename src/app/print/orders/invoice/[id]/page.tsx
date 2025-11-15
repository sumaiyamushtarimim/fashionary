
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getOrderById } from '@/services/orders';
import type { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Logo } from '@/components/logo';

export function InvoiceTemplate({ order }: { order: Order }) {
    const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const shipping = 5.00; // Placeholder
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 print:shadow-none print:p-8">
            <header className="flex justify-between items-center pb-6 border-b">
                <div className="flex items-center gap-4">
                    <Logo />
                    <div>
                        <h1 className="text-2xl font-bold font-headline">Fashionary</h1>
                        <p className="text-sm text-gray-500">123 Fashion Ave, Dhaka</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-500 uppercase">Invoice</h2>
                    <p className="text-sm">#<span className="font-medium">{order.id}</span></p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mt-8">
                <div>
                    <h3 className="font-semibold mb-2">Billed To:</h3>
                    <p className="font-bold">{order.customerName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.customerPhone}</p>
                    <p>{order.customerEmail}</p>
                </div>
                <div className="text-right">
                    <div className="grid grid-cols-2">
                        <span className="font-semibold">Invoice Date:</span>
                        <span>{format(new Date(order.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="grid grid-cols-2 mt-1">
                        <span className="font-semibold">Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left font-semibold w-20">Image</th>
                            <th className="p-3 text-left font-semibold">Item</th>
                            <th className="p-3 text-center font-semibold">Qty</th>
                            <th className="p-3 text-right font-semibold">Price</th>
                            <th className="p-3 text-right font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map(p => (
                            <tr key={p.productId} className="border-b">
                                <td className="p-3">
                                    <Image 
                                        src={p.image.imageUrl} 
                                        alt={p.name} 
                                        width={48} 
                                        height={48}
                                        className="rounded-md object-cover aspect-square"
                                    />
                                </td>
                                <td className="p-3">{p.name}</td>
                                <td className="p-3 text-center">{p.quantity}</td>
                                <td className="p-3 text-right">৳{p.price.toFixed(2)}</td>
                                <td className="p-3 text-right">৳{(p.price * p.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-8 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium">৳{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Tax (8%)</span>
                        <span className="font-medium">৳{tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>৳{total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-lg font-semibold pt-2">
                        <span>Paid</span>
                        <span>৳{order.paidAmount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-lg font-semibold">
                        <span className="text-red-500">Amount Due</span>
                        <span className="text-red-500">৳{(total - order.paidAmount).toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <footer className="mt-16 text-center text-sm text-gray-500 border-t pt-4">
                <p>Thank you for your business!</p>
            </footer>
        </div>
    );
}


export default function SingleInvoicePage() {
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
            <div className="max-w-4xl mx-auto p-8">
                <Skeleton className="h-24 w-full mb-8" />
                <Skeleton className="h-16 w-1/2 mb-8" />
                <Skeleton className="h-48 w-full mb-8" />
                <Skeleton className="h-32 w-1/3 ml-auto" />
            </div>
        );
    }
    
    if (!order) {
        return <div className="p-10 text-center">Order not found.</div>;
    }

    return (
        <div>
             <div className="p-4 bg-white shadow-md no-print sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-lg font-bold">Invoice Preview</h1>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                </Button>
            </div>
            <div className="p-4 print:p-0">
                <InvoiceTemplate order={order} />
            </div>
        </div>
    );
}
