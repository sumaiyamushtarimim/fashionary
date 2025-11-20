

'use client';

import type { Order } from '@/types';
import { format } from 'date-fns';
import { Logo } from '@/components/logo';
import Barcode from 'react-barcode';
import React from 'react';

export function StickerTemplate({ order }: { order: Order }) {
    const total = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0) + order.shipping;
    const codAmount = total - order.paidAmount;

    return (
        <div className="bg-white p-2 border" style={{ width: '75mm', height: '100mm' }}>
            <div className="h-full flex flex-col justify-between text-[10px] leading-tight">
                {/* Header */}
                <header className="flex justify-between items-start pb-1 border-b">
                    <div>
                        <p className="font-bold text-sm">FROM: Fashionary</p>
                        <p>123 Fashion Ave, Dhaka</p>
                        <p>Phone: +8801234567890</p>
                    </div>
                    <div className="w-12 h-12">
                        <Logo variant="icon" />
                    </div>
                </header>

                {/* To Section */}
                <section className="my-1">
                    <p className="font-bold text-sm">TO: {order.customerName}</p>
                    <p className="text-xs">{order.shippingAddress.address}, {order.shippingAddress.district}</p>
                    <p className="font-bold text-lg">{order.customerPhone}</p>
                </section>

                {/* Barcode and Details */}
                <section className="flex-grow flex flex-col justify-center items-center my-1">
                    <div className="w-full text-center">
                       <Barcode value={order.id} height={35} width={1.8} fontSize={14} margin={0} />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-2 mt-2 text-center">
                        <div>
                            <p className="font-bold">COD Amount:</p>
                            <p className="text-2xl font-bold">৳{codAmount > 0 ? codAmount.toFixed(2) : "0.00"}</p>
                        </div>
                        <div>
                            <p className="font-bold">Invoice #:</p>
                            <p className="text-2xl font-bold">{order.id}</p>
                        </div>
                    </div>
                </section>

                {/* Products List */}
                <section className="border-t pt-1">
                    <div className="grid grid-cols-4 gap-x-2 text-[8px]">
                        <div className="font-bold col-span-3">Product SKU</div>
                        <div className="font-bold text-right">Qty</div>
                        {order.products.map(p => (
                             <React.Fragment key={p.productId}>
                                <div className="col-span-3 truncate">{p.name} (SKU-XXX)</div>
                                <div className="text-right">{p.quantity}</div>
                             </React.Fragment>
                        ))}
                    </div>
                </section>


                {/* Footer */}
                <footer className="text-center pt-1 border-t mt-1">
                    <p>Order Date: {format(new Date(order.date), 'dd MMM, yyyy')}</p>
                </footer>
            </div>
        </div>
    );
}
