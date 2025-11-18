
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById, getOrdersByPhone } from '@/services/orders';
import type { Order, OrderProduct } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { OrderTimeline } from '@/components/ui/order-timeline';
import { cn } from '@/lib/utils';

const statusColors: Record<Order['status'], string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Packing Hold': 'bg-amber-500/20 text-amber-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'In-Courier': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Return Pending': 'bg-pink-500/20 text-pink-700',
    'Paid Returned': 'bg-amber-500/20 text-amber-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
};


function OrderDetailsView({ order }: { order: Order }) {
    const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + order.shipping + tax;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{order.id}</h1>
                    <p className="text-muted-foreground">Order placed on {format(new Date(order.date), "MMMM d, yyyy")}</p>
                </div>
                 <Badge
                    variant="outline"
                    className={cn('ml-auto sm:ml-0 text-lg py-1 px-4', statusColors[order.status])}
                >
                    {order.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                {order.products.map(product => (
                                    <div key={product.productId} className="flex items-center gap-4">
                                        <Image
                                            src={product.image.imageUrl}
                                            alt={product.name}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover aspect-square border"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                                        </div>
                                        <p className="font-mono">৳{(product.price * product.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2 text-sm'>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Subtotal</dt>
                                <dd className="font-mono">৳{subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Shipping</dt>
                                <dd className="font-mono">৳{order.shipping.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Tax</dt>
                                <dd className="font-mono">৳{tax.toFixed(2)}</dd>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between font-semibold">
                                <dt>Total</dt>
                                <dd className="font-mono">৳{total.toFixed(2)}</dd>
                            </div>
                             <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Paid</dt>
                                <dd className="font-mono text-green-600">৳{order.paidAmount.toFixed(2)}</dd>
                            </div>
                             <div className="flex items-center justify-between font-semibold">
                                <dt className={cn(total - order.paidAmount > 0 && "text-destructive")}>Amount Due</dt>
                                <dd className={cn("font-mono", total - order.paidAmount > 0 && "text-destructive")}>৳{(total - order.paidAmount).toFixed(2)}</dd>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderTimeline logs={order.logs} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function OrderListView({ orders }: { orders: Order[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>We found multiple orders associated with your phone number. Select an order to view its tracking details.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-md">
                    {orders.map((order, index) => (
                        <Link href={`/track-order/${order.id}`} key={order.id} className="block hover:bg-muted/50">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-semibold">{order.id}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(order.date), "MMMM d, yyyy")} - {order.products.length} item(s)
                                    </p>
                                </div>
                                <Badge variant="outline" className={cn(statusColors[order.status])}>
                                    {order.status}
                                </Badge>
                            </div>
                            {index < orders.length - 1 && <Separator />}
                        </Link>
                    ))}
                 </div>
            </CardContent>
        </Card>
    )
}

function LoadingView() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    )
}

function NotFoundView({ query }: { query: string }) {
    return (
         <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Not Found</h2>
            <p className="text-muted-foreground mt-2">
                We couldn't find any order with the ID or phone number: <strong>{query}</strong>
            </p>
            <Button asChild className="mt-6">
                <Link href="/track-order">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Try Another Search
                </Link>
            </Button>
        </div>
    )
}


export default function OrderTrackingResultPage() {
    const params = useParams();
    const query = params.query as string;

    const [order, setOrder] = React.useState<Order | null>(null);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchType, setSearchType] = React.useState<'orderId' | 'phone' | 'notFound'>('orderId');

    React.useEffect(() => {
        if (!query) return;
        setIsLoading(true);

        const isPhoneNumber = /^[0-9+]+$/.test(query) && query.length >= 11;

        if (isPhoneNumber) {
            setSearchType('phone');
            getOrdersByPhone(query).then(data => {
                if (data.length > 0) {
                    setOrders(data);
                } else {
                    setSearchType('notFound');
                }
                setIsLoading(false);
            });
        } else {
            setSearchType('orderId');
            getOrderById(query).then(data => {
                if (data) {
                    setOrder(data);
                } else {
                    setSearchType('notFound');
                }
                setIsLoading(false);
            });
        }
    }, [query]);

    return (
        <div className="container max-w-6xl py-8 px-4 sm:px-8">
            <div className="mb-6">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/track-order">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        New Search
                    </Link>
                </Button>
            </div>

            {isLoading && <LoadingView />}
            
            {!isLoading && searchType === 'orderId' && order && <OrderDetailsView order={order} />}
            {!isLoading && searchType === 'phone' && orders.length > 0 && <OrderListView orders={orders} />}
            {!isLoading && searchType === 'notFound' && <NotFoundView query={query} />}
        </div>
    );
}
