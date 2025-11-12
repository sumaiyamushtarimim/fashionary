
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  CreditCard,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  Truck,
  Handshake,
} from "lucide-react";
import Link from "next/link";

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
import { orders, OrderStatus } from "@/lib/placeholder-data";
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
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mb-6">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳12,189.41</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+125</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
