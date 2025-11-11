
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
import dynamic from 'next/dynamic';

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
import { orders } from "@/lib/placeholder-data";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardCharts = dynamic(() => import('@/components/dashboard-charts'), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Revenue & Profit Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent  className="flex justify-center items-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </CardContent>
        </Card>
    </div>
  )
});


const quickAccessItems = [
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
    { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
]

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

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
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
            <div className="text-2xl font-bold">$12,189.41</div>
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCharts />

        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="font-headline">Recent Orders</CardTitle>
              <CardDescription>
                An overview of the most recent orders.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/orders">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge
                        variant={
                          order.status === 'Completed' ? 'default' :
                          order.status === 'New' ? 'secondary' :
                          'outline'
                        }
                        className={
                          order.status === 'Completed' ? 'bg-green-500/20 text-green-700' :
                          order.status === 'New' ? 'bg-blue-500/20 text-blue-700' :
                          order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-700' : ''
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      ${order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
