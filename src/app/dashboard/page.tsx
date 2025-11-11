"use client";

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
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { orders, revenueData, ordersByStatusData } from "@/lib/placeholder-data";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

const ordersChartConfig: ChartConfig = {
    new: { label: "New", color: "hsl(var(--chart-1))" },
    processing: { label: "Processing", color: "hsl(var(--chart-2))" },
    completed: { label: "Completed", color: "hsl(var(--chart-5))" },
}

const quickAccessItems = [
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
    { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
]

export default function Dashboard() {
  const isMobile = useIsMobile();
  const chartData = isMobile ? revenueData.slice(-4) : revenueData;

  return (
    <>
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
                                    <Button variant="outline" className="flex flex-col h-20 w-full p-2 justify-center items-center">
                                        <item.icon className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs font-normal mt-1 sm:hidden">{item.label}</span>
                                        <span className="hidden sm:inline text-xs font-normal mt-1">{item.label}</span>
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
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Revenue & Profit Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={ordersChartConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                    <Pie data={ordersByStatusData} dataKey="value" nameKey="status" innerRadius={60}>
                       {ordersByStatusData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

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
                  <TableHead className="text-right">Amount</TableHead>
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
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
