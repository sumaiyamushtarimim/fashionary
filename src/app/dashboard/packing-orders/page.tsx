
'use client';

import * as React from 'react';
import Image from 'next/image';
import { getOrders } from '@/services/orders';
import type { Order, OrderProduct, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type PackingOrderStatus = 'Confirmed' | 'Packing Hold';

const statusColors: Record<PackingOrderStatus, string> = {
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Packing Hold': 'bg-amber-500/20 text-amber-700',
};


function OrderCard({ order, onStatusChange }: { order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void }) {
    const { toast } = useToast();

    const handleDone = () => {
        onStatusChange(order.id, 'RTS (Ready to Ship)');
        toast({
            title: "Order Ready for Shipping",
            description: `Order ${order.id} has been marked as "Ready to Ship".`
        })
    };

    const handleHold = () => {
        onStatusChange(order.id, 'Packing Hold');
        toast({
            title: "Order on Hold",
            description: `Order ${order.id} has been put on hold.`
        })
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50 gap-4 p-4">
                 <div className="w-20 h-20 rounded-lg border bg-background flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground"/>
                 </div>
                 <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        {order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                     <Badge 
                        variant="outline" 
                        className={cn("mt-2 w-fit", statusColors[order.status as PackingOrderStatus] || 'bg-gray-500/20 text-gray-700')}
                    >
                        {order.status}
                    </Badge>
                 </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {order.products.map(product => (
                    <div key={product.productId} className="flex flex-col items-center text-center gap-2">
                         <div className="relative">
                            <Image
                                src={product.image.imageUrl}
                                alt={product.name}
                                width={120}
                                height={120}
                                className="rounded-md object-cover aspect-square border"
                            />
                            <Badge className="absolute -top-2 -right-2">{product.quantity}</Badge>
                         </div>
                        <p className="text-xs font-medium leading-tight">{product.name}</p>
                    </div>
                ))}
            </CardContent>
            <Separator />
            <CardFooter className="p-4 grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleHold}>
                    <Clock className="mr-2 h-4 w-4" />
                    Hold
                </Button>
                <Button onClick={handleDone}>
                    <Check className="mr-2 h-4 w-4" />
                    Done
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function PackingOrdersPage() {
    const [allOrders, setAllOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        getOrders().then(data => {
            setAllOrders(data);
            setIsLoading(false);
        });
    }, []);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setAllOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const confirmedOrders = allOrders.filter(o => o.status === 'Confirmed');
    const onHoldOrders = allOrders.filter(o => o.status === 'Packing Hold');

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <div>
                    <h1 className="font-headline text-2xl font-bold">Packing Orders</h1>
                    <p className="text-muted-foreground hidden sm:block">
                        Ready-to-pack orders. Mark as done or put on hold.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="confirmed">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="confirmed">
                        Ready to Pack
                        <Badge variant="secondary" className="ml-2">{confirmedOrders.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="on-hold">
                        On Hold
                        <Badge variant="destructive" className="ml-2">{onHoldOrders.length}</Badge>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="confirmed">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                         {isLoading ? (
                            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[300px] w-full" />)
                        ) : confirmedOrders.length > 0 ? (
                            confirmedOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-muted-foreground py-16">
                                No orders ready for packing.
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="on-hold">
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {isLoading ? (
                             [...Array(2)].map((_, i) => <Skeleton key={i} className="h-[300px] w-full" />)
                        ) : onHoldOrders.length > 0 ? (
                            onHoldOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-muted-foreground py-16">
                                No orders on hold.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    