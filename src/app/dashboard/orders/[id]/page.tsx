
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  History,
} from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { orders, OrderStatus, OrderLog } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';


const statusColors: Record<OrderStatus, string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'Packing': 'bg-indigo-500/20 text-indigo-700',
    'Packing Hold': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Partially Delivered': 'bg-teal-500/20 text-teal-700',
    'Partially Returned': 'bg-amber-500/20 text-amber-700',
};

const statusIcons: Record<OrderStatus, React.ElementType> = {
    'New': Package,
    'Confirmed': CheckCircle,
    'Canceled': XCircle,
    'Hold': History,
    'Packing': Package,
    'Packing Hold': History,
    'RTS (Ready to Ship)': Package,
    'Shipped': Truck,
    'Delivered': CheckCircle,
    'Returned': History,
    'Partially Delivered': Truck,
    'Partially Returned': History,
};

const allStatuses: OrderStatus[] = [
    'New', 'Confirmed', 'Canceled', 'Hold', 'Packing', 'Packing Hold', 
    'RTS (Ready to Ship)', 'Shipped', 'Delivered', 'Returned', 
    'Partially Delivered', 'Partially Returned'
];


function OrderHistory({ logs }: { logs: OrderLog[] }) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                    {isClient ? (
                        <ul className="space-y-6">
                            {logs.map((log, index) => {
                                const Icon = statusIcons[log.status] || History;
                                const isLast = index === 0;
                                return (
                                    <li key={log.timestamp} className="relative flex items-start gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center bg-background border",
                                            isLast ? "border-primary" : "border-border"
                                        )}>
                                            <Icon className={cn("h-4 w-4", isLast ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className={cn("font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>{log.status}</p>
                                            <p className="text-sm text-muted-foreground">{log.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="space-y-6">
                            {logs.map((log) => (
                                <div key={log.timestamp} className="flex items-start gap-4">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 justify-center items-center">
        <p>Order not found.</p>
        <Button asChild>
          <Link href="/dashboard/orders">Go Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const subtotal = order.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const shipping = 5.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/orders">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {order.id}
        </h1>
        <Badge
          variant="outline"
          className={cn('ml-auto sm:ml-0', statusColors[order.status])}
        >
          {order.status}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Print Invoice
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="hidden sm:table-header-group">
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex flex-col sm:table-row-group gap-4">
                  {order.products.map((product) => (
                    <TableRow key={product.productId} className="flex sm:table-row flex-col sm:flex-row rounded-lg border sm:border-0 p-4 sm:p-0">
                      <TableCell className="p-0 sm:p-4 w-[80px] hidden sm:table-cell">
                        <Image
                          alt={product.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image.imageUrl}
                          width="64"
                        />
                      </TableCell>
                       <TableCell className="font-medium p-0 sm:p-4 w-full">
                            <div className="flex items-start gap-4 pb-4 border-b sm:border-0">
                                <Image
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover sm:hidden"
                                    height="64"
                                    src={product.image.imageUrl}
                                    width="64"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">SKU-452-187</p>
                                </div>
                            </div>
                            <div className="sm:hidden pt-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1">
                                        <p className="text-sm text-muted-foreground">Qty</p>
                                        <p className="font-medium">{product.quantity}</p>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="font-medium">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center font-medium">
                                    <span>Total</span>
                                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </TableCell>
                      <TableCell className="hidden sm:table-cell">SKU-452-187</TableCell>
                      <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                          {product.quantity}
                      </TableCell>
                      <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                        ${(product.price * product.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>${shipping.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <dt>Total</dt>
                <dd>${total.toFixed(2)}</dd>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="space-y-2">
                        <p className="font-medium">Order Date</p>
                        <p className="text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                     <Separator />
                     <div className="space-y-2">
                        <p className="font-medium">Update Status</p>
                        <Select defaultValue={order.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {allStatuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                     <Button className='w-full'>Save Changes</Button>
                </CardContent>
            </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{order.customerName}</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>1 order</p>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="font-medium">Shipping Information</div>
                <address className="not-italic text-muted-foreground">
                  1234 Main Street
                  <br />
                  Anytown, CA 12345
                </address>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="font-medium">Contact Information</div>
                <div className="text-muted-foreground">
                  <p>{order.customerEmail}</p>
                  <p>+1 234 567 890</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <OrderHistory logs={order.logs} />
        </div>
      </div>
    </div>
  );
}
