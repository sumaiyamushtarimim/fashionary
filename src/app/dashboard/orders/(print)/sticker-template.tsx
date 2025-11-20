

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
                        <p className="font-bold text-sm">FROM: {order.businessId === 'BIZ002' ? 'Urban Threads' : 'Fashionary'}</p>
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
                       <Barcode value={order.id} height={35} width={1.5} fontSize={12} margin={0} />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-2 mt-2 text-center">
                        <div>
                            <p className="font-bold">COD Amount:</p>
                            <p className="text-2xl font-bold">৳{codAmount > 0 ? codAmount.toFixed(0) : "0"}</p>
                        </div>
                        <div>
                            <p className="font-bold">Invoice #:</p>
                            <p className="text-lg font-bold">{order.id}</p>
                        </div>
                    </div>
                     <div className='w-full text-center mt-1'>
                        <p>Delivery Charge: ৳{order.shipping.toFixed(2)}</p>
                    </div>
                </section>

                {/* Products List */}
                <section className="border-t pt-1">
                    <div className="grid grid-cols-6 gap-x-1 text-[8px]">
                        <div className="font-bold col-span-3">Product (SKU)</div>
                        <div className="font-bold text-center">Qty</div>
                        <div className="font-bold col-span-2 text-right">Price</div>
                        {order.products.map(p => (
                             <React.Fragment key={p.productId}>
                                <div className="col-span-3 truncate">{p.name.substring(0, 25)}{p.name.length > 25 ? '...' : ''} (SKU-XXX)</div>
                                <div className="text-center">{p.quantity}</div>
                                <div className="col-span-2 text-right font-mono">৳{p.price.toFixed(2)}</div>
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
