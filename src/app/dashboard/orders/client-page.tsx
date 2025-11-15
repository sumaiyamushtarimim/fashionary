

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle, Truck, Printer, File as FileIcon, Download } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getOrders, getStatuses } from "@/services/orders";
import { getBusinesses, getCourierServices } from "@/services/partners";
import type { Order, OrderProduct, OrderStatus, Business, CourierService } from "@/types";
import { Label } from "@/components/ui/label";

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

export default function OrdersClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allOrders, setAllOrders] = React.useState<Order[]>([]);
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
  
  const [statusFilter, setStatusFilter] = React.useState(searchParams.get('status') || "all");
  const [businessFilter, setBusinessFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([
        getOrders(),
        getBusinesses(),
        getStatuses(),
        getCourierServices()
    ]).then(([ordersData, businessesData, statusesData, couriersData]) => {
        setAllOrders(ordersData);
        setBusinesses(businessesData);
        setAllStatuses(statusesData);
        setCourierServices(couriersData);
        setIsLoading(false);
    });

    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);
  
  const handleExport = (format: 'all' | 'steadfast' | 'pathao' | 'redx') => {
    const ordersToExport = selectedOrders.length > 0
        ? allOrders.filter(order => selectedOrders.includes(order.id))
        : filteredOrders;

    if (ordersToExport.length === 0) {
        alert("No orders to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    let headers: string[] = [];
    let rows: string[][] = [];

    switch (format) {
        case 'steadfast':
            headers = ['Invoice', 'Name', 'Address', 'Phone', 'Amount', 'Note', 'Lot', 'Delivery Type', 'Contact Name', 'Contact Phone'];
            rows = ordersToExport.map(order => {
                const business = businesses.find(b => b.id === order.businessId);
                const dueAmount = order.total - order.paidAmount;
                const lot = order.products.reduce((acc, p) => acc + p.quantity, 0);

                return [
                    order.id,
                    order.customerName,
                    order.shippingAddress.address.replace(/,/g, ''),
                    order.customerPhone,
                    dueAmount.toString(),
                    order.officeNote?.replace(/,/g, '') || '',
                    lot.toString(),
                    'Home',
                    business?.name || '',
                    '01234567890' // Placeholder for business phone
                ];
            });
            break;
        
        case 'redx':
            headers = ['CustomerName(*)', 'CustomerPhone(*)', 'CustomerAddress(*)', 'AltPhone', 'CustomerArea (*)', 'Category', 'InvoiceID', 'Weight(*)', 'Cash(*)', 'SellingPrice(*)', 'PaidReturnCharge', 'Instructions'];
            rows = ordersToExport.map(order => {
                 const dueAmount = order.total - order.paidAmount;
                 return [
                    order.customerName,
                    order.customerPhone,
                    order.shippingAddress.address.replace(/,/g, ''),
                    '', // AltPhone
                    order.shippingAddress.district,
                    'Clothing and Apparel > Women clothing', // Category
                    order.id,
                    '0.5', // Weight
                    dueAmount.toString(), // Cash
                    order.total.toString(), // SellingPrice
                    (order.shipping || 60).toString(),
                    order.officeNote?.replace(/,/g, '') || '', // Instructions
                 ];
            });
            break;
            
        case 'pathao':
            headers = ['ItemType', 'StoreName', 'MerchantOrderld', 'RecipientName(*)', 'RecipientPhone(*)', 'RecipientAddress(*)', 'RecipientCity(*)', 'RecipientZone(*)', 'RecipientArea', 'AmountToCollect(*)', 'ItemQuantity', 'ItemWeight', 'ItemDesc', 'SpecialInstruction'];
            rows = ordersToExport.map(order => {
                const business = businesses.find(b => b.id === order.businessId);
                const dueAmount = order.total - order.paidAmount;
                const itemQuantity = order.products.reduce((acc, p) => acc + p.quantity, 0);

                return [
                    '2', // ItemType (Parcel)
                    business?.name || '', // StoreName
                    order.id, // MerchantOrderld
                    order.customerName, // RecipientName(*)
                    order.customerPhone, // RecipientPhone(*)
                    order.shippingAddress.address.replace(/,/g, ''), // RecipientAddress(*)
                    order.shippingAddress.district, // RecipientCity(*)
                    '', // RecipientZone(*)
                    '', // RecipientArea
                    dueAmount.toString(), // AmountToCollect(*)
                    itemQuantity.toString(), // ItemQuantity
                    '0.5', // ItemWeight
                    order.products.map(p => p.name).join(', '), // ItemDesc
                    order.officeNote?.replace(/,/g, '') || '', // SpecialInstruction
                ];
            });
            break;

        case 'all':
        default:
            const allHeaders = [...new Set(ordersToExport.flatMap(obj => Object.keys(obj)))];
            headers = allHeaders;
            rows = ordersToExport.map(order => {
                return allHeaders.map(header => {
                    const value = (order as any)[header];
                    if (typeof value === 'object' && value !== null) {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    return `"${String(value).replace(/"/g, '""')}"`;
                });
            });
            break;
    }
    
    csvContent += headers.join(",") + "\r\n";
    rows.forEach(rowArray => {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${format}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkPrint = (type: 'invoice' | 'sticker') => {
    if (selectedOrders.length === 0) return;
    const ids = selectedOrders.join(',');
    window.open(`/print/orders/bulk?type=${type}&ids=${ids}`, '_blank');
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    router.replace(`/dashboard/orders?${params.toString()}`);
  };

  const filteredOrders = React.useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allOrders.filter((order) => {
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      const businessMatch = businessFilter === 'all' || order.businessId === businessFilter;
      
      const orderDate = new Date(order.date);
      const dateMatch = !dateRange?.from || (dateRange?.from && dateRange?.to 
        ? isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
        : true);

      const searchMatch = !searchTerm || (
        order.id.toLowerCase().includes(lowercasedSearchTerm) ||
        order.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
        order.customerPhone.toLowerCase().includes(lowercasedSearchTerm) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(lowercasedSearchTerm))
      );

      return statusMatch && businessMatch && dateMatch && searchMatch;
    });
  }, [statusFilter, businessFilter, dateRange, searchTerm, allOrders]);
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);


  React.useEffect(() => {
    setSelectedOrders([]);
    setCurrentPage(1);
  }, [statusFilter, businessFilter, dateRange, searchTerm, itemsPerPage]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const isAllSelected = selectedOrders.length > 0 && selectedOrders.length === paginatedOrders.length;
  const isSomeSelected = selectedOrders.length > 0 && selectedOrders.length < paginatedOrders.length;


  const renderTable = () => (
     <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox">
                  <Checkbox
                    checked={isAllSelected || (isSomeSelected && 'indeterminate')}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
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
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} data-state={selectedOrders.includes(order.id) && "selected"}>
                   <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        aria-label={`Select order ${order.id}`}
                      />
                    </TableCell>
                   <TableCell className="font-medium">
                     <div className="flex items-center gap-4">
                        <div>
                            <OrderImages products={order.products} />
                        </div>
                        <div>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                     </div>
                   </TableCell>
                  <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={"outline"}
                      className={cn(
                        statusColors[order.status] ||
                          "bg-gray-500/20 text-gray-700"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ৳{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                     <div>
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
                            <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  );

  const renderCardList = () => (
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
            <Card key={order.id} className={cn("relative", selectedOrders.includes(order.id) && "border-primary")}>
                <div className="absolute top-2 left-2">
                    <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        aria-label={`Select order ${order.id}`}
                    />
                </div>
                <CardContent className="p-4 pl-10">
                    <div className="flex items-start gap-4">
                        <OrderImages products={order.products} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{order.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{order.id}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild><Link href={`/dashboard/orders/${order.id}`}>View Details</Link></DropdownMenuItem>
                                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{format(new Date(order.date), "MMM d, yyyy")}</p>
                            <div className="mt-2 flex justify-between items-center">
                                <Badge variant={"outline"} className={cn(statusColors[order.status] || "bg-gray-500/20 text-gray-700")}>
                                    {order.status}
                                </Badge>
                                <p className="font-bold text-lg">৳{order.total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-grow">
            <div className="flex items-center justify-between gap-2">
                <Select value={businessFilter} onValueChange={setBusinessFilter}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
                    <SelectValue placeholder="Filter by business" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Businesses</SelectItem>
                    {businesses.map(business => (
                        <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="sm:hidden">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} placeholder="Filter by date" />
            </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {allStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <div className="sm:hidden">
                    <Button size="sm" asChild>
                        <Link href="/dashboard/orders/new">
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only">Add Order</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 justify-end">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} placeholder="Filter by date" />
            <Button size="sm" asChild>
                <Link href="/dashboard/orders/new">
                    <PlusCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Order</span>
                    <span className="sm:hidden sr-only">Add Order</span>
                </Link>
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Orders</CardTitle>
          <CardDescription>
            Manage and track all customer orders.
          </CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by Order ID, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedOrders.length} selected</span>
                     <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">Bulk Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Actions for {selectedOrders.length} orders</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {allStatuses.map(status => (
                                                <DropdownMenuItem key={status}>Mark as {status}</DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => handleBulkPrint('invoice')}>
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                Invoices
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleBulkPrint('sticker')}>
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                Stickers
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                             <DropdownMenuItem onClick={() => handleExport('all')}>All Selected</DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleExport('steadfast')}>Steadfast Format</DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleExport('pathao')}>Pathao Format</DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleExport('redx')}>RedX Format</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Truck className="mr-2 h-4 w-4" />
                                        Send to Courier
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {courierServices.map(courier => (
                                                 <AlertDialogTrigger asChild key={courier}>
                                                    <DropdownMenuItem>{courier}</DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Selected</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Bulk Dispatch</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to dispatch {selectedOrders.length} selected orders? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Confirm & Dispatch</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              )}
            </div>
        </CardHeader>
        <CardContent>
           {isLoading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading orders...</div>
            ) : (
              <>
                <div className="hidden sm:block">{renderTable()}</div>
                <div className="sm:hidden">{renderCardList()}</div>
              </>
            )}
        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                    <Label htmlFor="items-per-page" className="whitespace-nowrap">Rows per page</Label>
                    <Input 
                      id="items-per-page"
                      type="number"
                      min="1"
                      className="h-8 w-16"
                      value={itemsPerPage}
                      onChange={(e) => {
                          const value = Number(e.target.value);
                          if(value > 0) setItemsPerPage(value);
                      }}
                    />
                </div>
                <div className="flex-1 text-center min-w-[150px]">
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                    </strong> of <strong>{filteredOrders.length}</strong> orders
                </div>
                 {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1))}} 
                                    className={cn('h-8', currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
                                />
                            </PaginationItem>
                             <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1))}}
                                    className={cn('h-8', currentPage === totalPages ? 'pointer-events-none opacity-50' : '')} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
