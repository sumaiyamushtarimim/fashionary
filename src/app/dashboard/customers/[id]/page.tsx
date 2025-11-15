'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  ShoppingCart,
  DollarSign,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getCustomerById } from '@/services/customers';
import { getOrdersByCustomer } from '@/services/orders';
import type { Customer, Order, OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'In-Courier': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Paid Returned': 'bg-amber-500/20 text-amber-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
};


export default function CustomerDetailsPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = React.useState<Customer | undefined>(undefined);
  const [customerOrders, setCustomerOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
      if (customerId) {
          setIsLoading(true);
          getCustomerById(customerId).then(customerData => {
              setCustomer(customerData);
              if (customerData) {
                  getOrdersByCustomer(customerData.name).then(ordersData => {
                      setCustomerOrders(ordersData);
                  });
              }
          }).finally(() => setIsLoading(false));
      }
  }, [customerId]);

  if (isLoading) {
      return <div className="p-6">Loading customer details...</div>
  }

  if (!customer) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
        <p>Customer not found.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/customers">Back to Customers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/customers">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold sm:text-2xl">
            {customer.name}
          </h1>
           <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span>Joined on {format(new Date(customer.joinDate), "MMMM d, yyyy")}</span>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <address className="not-italic text-muted-foreground">
                {customer.address}, {customer.district}, {customer.country}
              </address>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{customer.totalOrders}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
                <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">৳{customer.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A list of all orders placed by this customer.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="hidden sm:block">
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customerOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-primary hover:underline">
                            {order.id}
                        </Link>
                        </TableCell>
                        <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                            <Badge variant={'outline'} className={cn(statusColors[order.status] || 'bg-gray-500/20 text-gray-700')}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">৳{order.total.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
           </div>
           <div className="sm:hidden space-y-4">
                {customerOrders.map((order) => (
                    <Card key={order.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link href={`/dashboard/orders/${order.id}`} className="font-semibold hover:underline">{order.id}</Link>
                                    <p className="text-sm text-muted-foreground">{format(new Date(order.date), "MMM d, yyyy")}</p>
                                </div>
                                <Badge variant={'outline'} className={cn('text-xs', statusColors[order.status] || 'bg-gray-500/20 text-gray-700')}>
                                    {order.status}
                                </Badge>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex justify-end items-center">
                                <p className="font-semibold font-mono text-lg">৳{order.total.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
           </div>
            {customerOrders.length === 0 && (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                No orders found for this customer.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
