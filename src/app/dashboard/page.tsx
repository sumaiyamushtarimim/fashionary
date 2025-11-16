
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
  Wallet,
  Landmark,
  BarChartHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
import { useRouter } from 'next/navigation';


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
import { allStatuses } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/services/orders";
import type { Order, OrderStatus, StaffRole } from "@/types";

// Mock user role. In a real app, this would come from your auth context (e.g., Clerk session claims).
const MOCK_USER_ROLE: StaffRole = 'Admin'; // Change to 'Packing Assistant' to test the redirect
const isPackingAssistant = MOCK_USER_ROLE === 'Packing Assistant';

const mainQuickAccessItems = [
    { 
        href: isPackingAssistant ? "/dashboard/packing-orders" : "/dashboard/orders", 
        icon: isPackingAssistant ? ClipboardList : ShoppingCart, 
        label: isPackingAssistant ? "Packing Orders" : "Orders", 
        color: "text-sky-500", 
        bgColor: "bg-sky-500/10" 
    },
    { href: "/dashboard/products", icon: Package, label: "Products", color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory", color: "text-lime-500", bgColor: "bg-lime-500/10" },
    { href: "/dashboard/customers", icon: Users, label: "Customers", color: "text-violet-500", bgColor: "bg-violet-500/10" },
];

const secondaryQuickAccessItems = [
  { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
  { href: "/dashboard/expenses", icon: Wallet, label: "Expenses" },
  { href: "/dashboard/check-passing", icon: Landmark, label: "Check Passing"},
  { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
  { href: "/dashboard/analytics", icon: BarChartHorizontal, label: "Analytics" },
  { href: "/dashboard/staff", icon: User, label: "Staff" },
];


const statusColors: Record<OrderStatus, string> = {
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
    'Paid Returned': 'bg-amber-500/20 text-amber-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
};


export default function Dashboard() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    const [allOrders, setAllOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        setIsLoading(true);
        getOrders().then(data => {
            setAllOrders(data);
            setIsLoading(false);
        });
    }, []);

    const filteredOrders = React.useMemo(() => {
        if (!dateRange?.from) return allOrders;
        return allOrders.filter(order => {
            const orderDate = new Date(order.date);
            return isWithinInterval(orderDate, { start: dateRange.from!, end: dateRange.to || dateRange.from });
        });
    }, [dateRange, allOrders]);


    const orderStats = React.useMemo(() => {
        const stats = allStatuses.reduce((acc, status) => {
            acc[status] = { count: 0, total: 0 };
            return acc;
        }, {} as Record<OrderStatus, { count: number; total: number }>);

        filteredOrders.forEach((order) => {
            if (stats[order.status]) {
                stats[order.status].count++;
                stats[order.status].total += order.total;
            }
        });

        return stats;
    }, [filteredOrders]);

    const handleStatusClick = (status: OrderStatus) => {
        const params = new URLSearchParams();
        params.set('status', status);
        router.push(`/dashboard/orders?${params.toString()}`);
    };

    const statusEntries = allStatuses.map(status => ({
        status,
        ...orderStats[status]
    })).filter(stat => stat.count > 0);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
                <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your business operations.</p>
            </div>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TooltipProvider>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {mainQuickAccessItems.map((item) => (
                              <Tooltip key={item.href}>
                                  <TooltipTrigger asChild>
                                  <Link href={item.href}>
                                      <Card className="hover:bg-muted/50 transition-colors h-full">
                                          <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                                              <div className={cn("p-3 rounded-full", item.bgColor)}>
                                                  <item.icon className={cn("h-6 w-6", item.color)} />
                                              </div>
                                              <span className="text-sm font-medium mt-1 text-center">{item.label}</span>
                                          </CardContent>
                                      </Card>
                                  </Link>
                                  </TooltipTrigger>
                                  <TooltipContent className="sm:hidden">
                                  <p>{item.label}</p>
                                  </TooltipContent>
                              </Tooltip>
                          ))}
                      </div>
                  </TooltipProvider>

                  <Separator />

                  <TooltipProvider>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {secondaryQuickAccessItems.map((item) => (
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

            <Card>
                <CardHeader>
                    <CardTitle>Order Summary by Status</CardTitle>
                    <CardDescription>
                        A breakdown of orders based on their current status for the selected date range.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center h-24 flex items-center justify-center">Loading data...</div>
                    ) : (
                        <>
                            {/* For larger screens */}
                            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {statusEntries.map(({ status, count, total }) => (
                                    <Card key={status} onClick={() => handleStatusClick(status)} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <CardHeader className="pb-2">
                                            <Badge variant="outline" className={cn("w-fit", statusColors[status])}>
                                                {status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">orders</span></p>
                                            <p className="text-sm font-semibold font-mono text-muted-foreground">৳{total.toLocaleString()}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {/* For smaller screens */}
                            <div className="sm:hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Count</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {statusEntries.map(({ status, count, total }) => (
                                            <TableRow key={status} onClick={() => handleStatusClick(status)} className="cursor-pointer">
                                                <TableCell>
                                                    <Badge variant="outline" className={cn(statusColors[status])}>
                                                        {status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">{count}</TableCell>
                                                <TableCell className="text-right font-mono">৳{total.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
