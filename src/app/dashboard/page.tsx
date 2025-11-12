
'use client';

import {
  Activity,
  ArrowUpRight,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  Truck,
  Handshake,
  PackageCheck,
  PackagePlus,
  Ship,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { orders, OrderStatus, Order } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const quickAccessItems = [
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
    { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
]

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

export default function Dashboard() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

    const filteredOrders = React.useMemo(() => {
        if (!dateRange?.from) return orders;
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            return isWithinInterval(orderDate, { start: dateRange.from!, end: dateRange.to || dateRange.from });
        });
    }, [dateRange]);


    const orderStats = React.useMemo(() => {
        return filteredOrders.reduce((acc, order) => {
            if (acc[order.status]) {
                acc[order.status]++;
            } else {
                acc[order.status] = 1;
            }
            return acc;
        }, {} as Record<OrderStatus, number>);
    }, [filteredOrders]);

    const recentOrders = React.useMemo(() => {
        return [...filteredOrders]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [filteredOrders]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
                <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your business operations.</p>
            </div>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5 md:gap-8">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange?.from ? format(dateRange.from, "MMM d") : ''}
              {dateRange?.to ? ` - ${format(dateRange.to, "MMM d")}` : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <PackagePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{orderStats['New'] || 0}</div>
             <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats['Packing'] || 0}</div>
             <p className="text-xs text-muted-foreground">
              Items being prepared
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats['Shipped'] || 0}</div>
             <p className="text-xs text-muted-foreground">
              On the way to customers
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats['Delivered'] || 0}</div>
             <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {order.customerEmail}
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                             <Badge
                                variant={"outline"}
                                className={cn('text-xs', 
                                    statusColors[order.status] || "bg-gray-500/20 text-gray-700"
                                )}
                                >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {format(new Date(order.date), "MMM d, yyyy")}
                        </TableCell>
                         <TableCell className="text-right font-mono">৳{order.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
             {recentOrders.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No orders found for the selected date range.
                </div>
             )}
          </CardContent>
        </Card>
         <Card className="lg:col-span-3">
              <CardHeader>
                  <CardTitle className="font-headline">Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                    <div className="grid grid-cols-3 gap-3">
                        {quickAccessItems.map((item) => (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                <Link href={item.href}>
                                    <Button variant="outline" className="flex flex-col h-20 w-full p-2 justify-center items-center gap-1">
                                        <item.icon className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs font-normal mt-1 text-center">{item.label}</span>
                                    </Button>
                                </Link>
                                </TooltipTrigger>
                                <TooltipContent className="sm:hidden">
                                <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

  