
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orders, OrderStatus, OrderProduct } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

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

const allStatuses: OrderStatus[] = [
    'New', 'Confirmed', 'Canceled', 'Hold', 'Packing', 'Packing Hold', 
    'RTS (Ready to Ship)', 'Shipped', 'Delivered', 'Returned', 
    'Partially Delivered', 'Partially Returned'
];

function OrderImages({ products }: { products: OrderProduct[] }) {
    const firstProduct = products[0];
    if (!firstProduct) return null;

    if (products.length > 1) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className="relative cursor-pointer">
                        <Image
                            src={firstProduct.image.imageUrl}
                            alt={firstProduct.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover aspect-square"
                        />
                        <div className="absolute top-0 right-0 -mt-2 -mr-2">
                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center">
                                +{products.length - 1}
                            </Badge>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Products in this Order</DialogTitle>
                        <DialogDescription>
                            All products included in this customer order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {products.map(product => (
                            <div key={product.productId} className="flex items-center gap-4">
                                <Image
                                    src={product.image.imageUrl}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover aspect-square"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    
    return (
        <Image
            src={firstProduct.image.imageUrl}
            alt={firstProduct.name}
            width={64}
            height={64}
            className="rounded-md object-cover aspect-square"
        />
    );
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      
      const orderDate = new Date(order.date);
      const dateMatch = dateRange?.from && dateRange?.to 
        ? isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
        : true;

      return statusMatch && dateMatch;
    });
  }, [statusFilter, dateRange]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  {allStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <div className="flex flex-row-reverse sm:flex-row gap-2">
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Order
          </Button>
           <Button size="sm" variant="outline">
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Orders</CardTitle>
          <CardDescription>
            {statusFilter === "all" ? "Manage and track all customer orders." : `Showing orders with status: ${statusFilter}`}
            {dateRange?.from && ` from ${format(dateRange.from, "LLL dd, y")}`}
            {dateRange?.to && ` to ${format(dateRange.to, "LLL dd, y")}`}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  Total
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="relative sm:table-row flex flex-col sm:flex-row p-4 sm:p-0 mb-4 sm:mb-0 border rounded-lg sm:border-b">
                   <TableCell className="font-medium p-0 sm:p-4 border-b sm:border-none pb-4 sm:pb-4">
                     <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                            <OrderImages products={order.products} />
                        </div>
                        <div>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                     </div>
                   </TableCell>
                   <TableCell className="p-0 sm:p-4 pt-4 sm:pt-4">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="sm:hidden">
                            <OrderImages products={order.products} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div className="md:hidden">
                               <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="hidden md:table-cell w-full">{format(new Date(order.date), "MMM d, yyyy")}</div>
                            <div className="sm:w-full">
                                <Badge
                                variant={"outline"}
                                className={cn("mt-2 sm:mt-0 w-full sm:w-auto justify-center",
                                    statusColors[order.status] || "bg-gray-500/20 text-gray-700"
                                )}
                                >
                                {order.status}
                                </Badge>
                            </div>
                           <div className="text-right font-bold sm:hidden mt-2 sm:mt-0">
                                ${order.total.toFixed(2)}
                            </div>
                        </div>
                   </div>
                  </TableCell>
                  <td className="hidden md:table-cell p-4">{format(new Date(order.date), "MMM d, yyyy")}</td>
                  <td className="hidden sm:table-cell p-4">
                    <Badge
                      variant={"outline"}
                      className={cn(
                        statusColors[order.status] ||
                          "bg-gray-500/20 text-gray-700"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="hidden text-right sm:table-cell p-4">
                    ${order.total.toFixed(2)}
                  </td>
                  <TableCell className="p-0 sm:p-4">
                     <div className="absolute sm:relative top-2 right-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                            Cancel Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

    