'use client';

import type { Order } from '@/types';
import { format } from 'date-fns';
import Barcode from 'react-barcode';
import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

export function StickerTemplate({ order }: { order: Order }) {
    const total = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0) + order.shipping;
    const codAmount = total - order.paidAmount;

    // Use businessName from order if available, otherwise fallback to existing logic
    const businessName = order.businessName || (order.businessId === 'BIZ002' ? 'Urban Threads' : 'Fashionary');

    return (
        <>
            <div className="sticker-container bg-white p-2 border" style={{ width: '75mm', height: '100mm' }}>
                <div className="h-full w-full flex flex-col text-[10px] leading-tight font-sans">
                    {/* Header */}
                    <header className="text-center border-b pb-1">
                        <h1 className="text-lg font-bold">{businessName}</h1>
                        <p className="text-xs">Phone: +8801234567890</p>
                    </header>

                    {/* Recipient Info */}
                    <section className="py-2 space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <p className="font-bold text-base leading-snug">{order.customerName}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <p className="text-xs leading-snug">{order.shippingAddress.address}, {order.shippingAddress.district}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <p className="text-sm font-bold mt-1">{order.customerPhone}</p>
                        </div>
                    </section>
                    
                    {/* Barcode */}
                    <section className="text-center my-2">
                       <Barcode value={order.id} height={35} width={1.5} fontSize={12} margin={0} />
                    </section>
                    
                    {/* Pricing Info */}
                    <section className="grid grid-cols-3 gap-2 text-center my-2">
                        <div>
                            <p className="font-bold uppercase text-[9px]">COD Amount</p>
                            <p className="text-base font-bold">৳{codAmount > 0 ? codAmount.toFixed(0) : "0"}</p>
                        </div>
                        <div>
                            <p className="font-bold uppercase text-[9px]">Delivery</p>
                            <p className="text-base font-bold">৳{order.shipping > 0 ? order.shipping.toFixed(0) : "0"}</p>
                        </div>
                        <div>
                            <p className="font-bold uppercase text-[9px]">Total</p>
                            <p className="text-base font-bold">৳{total > 0 ? total.toFixed(0) : "0"}</p>
                        </div>
                    </section>

                    {/* Products List - This section will grow but be contained */}
                    <section className="product-list-container border-t pt-1 flex-grow overflow-y-auto">
                        <div className="grid grid-cols-[1fr,auto,auto] gap-x-2 text-[9px] font-medium">
                            <div className="font-bold">Product</div>
                            <div className="font-bold text-center">Qty</div>
                            <div className="font-bold text-right">Price</div>
                        </div>
                        <div className="product-list-items text-[9px]">
                             {order.products.map(p => (
                                 <div key={p.productId} className="grid grid-cols-[1fr,auto,auto] gap-x-2">
                                    <div className="truncate pr-1">{p.name}</div>
                                    <div className="text-center">{p.quantity}</div>
                                    <div className="text-right font-mono">৳{p.price.toFixed(0)}</div>
                                 </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Footer */}
                    <footer className="text-center pt-1 border-t mt-auto">
                        <p>Order Date: {format(new Date(order.date), 'dd MMM, yyyy')}</p>
                    </footer>
                </div>
            </div>
             <style jsx global>{`
                .sticker-container {
                    font-family: 'Inter', sans-serif;
                }
                .product-list-container {
                    max-height: 40px; /* Adjust this value as needed */
                }
            `}</style>
        </>
    );
}

// Helper to get business name, assuming you might not have it directly on the order object.
// In a real app, the order object should ideally contain the businessName.
function getBusinessNameFromId(businessId: string, businesses: {id: string, name: string}[]) {
    const business = businesses.find(b => b.id === businessId);
    return business ? business.name : 'Fashionary';
}
