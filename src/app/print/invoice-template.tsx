
'use client';

import Image from 'next/image';
import type { Order } from '@/types';
import { format } from 'date-fns';
import { Logo } from '@/components/logo';
import Barcode from 'react-barcode';

export function InvoiceTemplate({ order }: { order: Order }) {
    const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const shipping = order.shipping || 0;
    const total = subtotal + shipping;

    return (
        <>
            <style jsx global>{`
                @media print {
                    .invoice-page {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 1.5rem;
                        display: flex;
                        flex-direction: column;
                    }
                    .invoice-footer {
                        margin-top: auto;
                    }
                }
            `}</style>
            <div className="invoice-page max-w-4xl mx-auto p-8 bg-white text-gray-800 print:shadow-none print:p-6">
                <div className="flex-grow">
                    <header className="flex justify-between items-start pb-6 border-b">
                        <div className="flex items-center gap-4">
                            <Logo variant="icon" />
                            <div>
                                <h1 className="text-2xl font-bold font-headline text-primary">Fashionary</h1>
                                <p className="text-sm text-gray-500">123 Fashion Ave, Dhaka</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-gray-400 uppercase">Invoice</h2>
                            <div className="mt-2 flex justify-end">
                                <Barcode value={order.id} height={30} width={1.2} fontSize={10} margin={0} />
                            </div>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 mt-8">
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-600">Billed To:</h3>
                            <p className="font-bold">{order.customerName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.customerPhone}</p>
                            <p>{order.customerEmail}</p>
                        </div>
                        <div className="text-right">
                            <div className="grid grid-cols-2">
                                <span className="font-semibold text-gray-600">Invoice Date:</span>
                                <span>{format(new Date(order.date), 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="grid grid-cols-2 mt-1">
                                <span className="font-semibold text-gray-600">Payment Method:</span>
                                <span>{order.paymentMethod}</span>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left font-semibold text-gray-600 w-20">Image</th>
                                    <th className="p-3 text-left font-semibold text-gray-600">Item</th>
                                    <th className="p-3 text-center font-semibold text-gray-600">Qty</th>
                                    <th className="p-3 text-right font-semibold text-gray-600">Price</th>
                                    <th className="p-3 text-right font-semibold text-gray-600">Total</th>
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
                                        <td className="p-3 font-medium">{p.name}</td>
                                        <td className="p-3 text-center">{p.quantity}</td>
                                        <td className="p-3 text-right font-mono">৳{p.price.toFixed(2)}</td>
                                        <td className="p-3 text-right font-mono">৳{(p.price * p.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="mt-8 flex justify-end">
                        <div className="w-full max-w-sm space-y-2 rounded-lg border p-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium font-mono">৳{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium font-mono">৳{shipping.toFixed(2)}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="font-mono">৳{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold pt-2 text-green-600">
                                <span>Paid</span>
                                <span className="font-mono">৳{order.paidAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-red-500">Amount Due</span>
                                <span className="text-red-500 font-mono">৳{(total - order.paidAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="invoice-footer border-t pt-4">
                    <p className="text-center text-sm text-gray-500">Thank you for your purchase!</p>
                </footer>
            </div>
        </>
    );
}
