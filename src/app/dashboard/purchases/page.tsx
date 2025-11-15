
'use client';

import { MoreHorizontal, PlusCircle, Printer, DollarSign, Scissors } from "lucide-react";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import React, { useState, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { getPurchaseOrders } from "@/services/purchases";
import type { PurchaseOrder } from "@/types";

const ITEMS_PER_PAGE = 10;

const statusColors = {
    'Received': 'bg-green-500/20 text-green-700',
    'Cutting': 'bg-purple-500/20 text-purple-700',
    'Printing': 'bg-yellow-500/20 text-yellow-700',
    'Fabric Ordered': 'bg-blue-500/20 text-blue-700',
    'Draft': 'bg-gray-500/20 text-gray-700',
    'Cancelled': 'bg-red-500/20 text-red-700',
};

export default function PurchasesPage() {
    const [allPurchaseOrders, setAllPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        getPurchaseOrders().then(data => {
            setAllPurchaseOrders(data);
            setIsLoading(false);
        });
    }, []);

    const overviewStats = useMemo(() => {
        const stats = {
            inPrintingQty: 0,
            inPrintingValue: 0,
            inCuttingQty: 0,
            inCuttingValue: 0,
        };

        allPurchaseOrders.forEach(po => {
            if (po.status === 'Printing') {
                stats.inPrintingQty += po.items;
                stats.inPrintingValue += po.total;
            } else if (po.status === 'Cutting') {
                stats.inCuttingQty += po.items;
                stats.inCuttingValue += po.total;
            }
        });

        return stats;
    }, [allPurchaseOrders]);

    const filteredPurchaseOrders = useMemo(() => {
        return allPurchaseOrders.filter((po) => {
            const poDate = new Date(po.date);
            const dateMatch = !dateRange?.from || (dateRange?.from && dateRange?.to 
                ? isWithinInterval(poDate, { start: dateRange.from, end: dateRange.to })
                : true);

            return dateMatch;
        });
    }, [dateRange, allPurchaseOrders]);

    const totalPages = Math.ceil(filteredPurchaseOrders.length / ITEMS_PER_PAGE);
    const paginatedPurchaseOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPurchaseOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPurchaseOrders, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [dateRange]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden sm:block">
            <h1 className="font-headline text-2xl font-bold">Purchases</h1>
            <p className="text-muted-foreground">Manage purchase orders and supplier payments.</p>
        </div>
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-2">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} placeholder="Filter by date" />
          <Button size="sm" asChild>
            <Link href="/dashboard/purchases/new">
                <PlusCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Purchase Order</span>
                <span className="sr-only sm:hidden">New Purchase Order</span>
            </Link>
          </Button>
        </div>
      </div>
      
       <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Printing</CardTitle>
                    <Printer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overviewStats.inPrintingQty.toLocaleString()} units</div>
                    <p className="text-xs text-muted-foreground">
                        Valued at ৳{overviewStats.inPrintingValue.toLocaleString()}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Cutting</CardTitle>
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overviewStats.inCuttingQty.toLocaleString()} units</div>
                    <p className="text-xs text-muted-foreground">
                         Valued at ৳{overviewStats.inCuttingValue.toLocaleString()}
                    </p>
                </CardContent>
            </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Loading purchase orders...
            </div>
          ) : (
            <>
              {/* Table for larger screens */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPurchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/purchases/${po.id}`} className="hover:underline">
                            {po.id}
                          </Link>
                        </TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell>{format(new Date(po.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={'outline'} className={cn(statusColors[po.status] || 'bg-gray-500/20 text-gray-700')}>
                              {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">৳{po.total.toFixed(2)}</TableCell>
                        <TableCell>
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
                                 <Link href={`/dashboard/purchases/${po.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Mark as Received</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Card list for smaller screens */}
              <div className="sm:hidden space-y-4">
                {paginatedPurchaseOrders.map((po) => (
                    <Card key={po.id} className="overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link href={`/dashboard/purchases/${po.id}`} className="font-semibold hover:underline">
                                      {po.id}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{po.supplier}</p>
                                </div>
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
                                        <Link href={`/dashboard/purchases/${po.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Received</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{format(new Date(po.date), "MMM d, yyyy")}</p>
                                    <Badge variant={'outline'} className={cn('text-xs', statusColors[po.status] || 'bg-gray-500/20 text-gray-700')}>
                                        {po.status}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="font-semibold font-mono">৳{po.total.toFixed(2)}</p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredPurchaseOrders.length)}
                    </strong> of <strong>{filteredPurchaseOrders.length}</strong> purchase orders
                </div>
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1))}} 
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1))}}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
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
