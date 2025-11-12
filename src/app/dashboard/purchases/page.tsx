
'use client';

import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import React, { useState, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { purchaseOrders } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";


const statusColors = {
    'Received': 'bg-green-500/20 text-green-700',
    'Cutting': 'bg-purple-500/20 text-purple-700',
    'Printing': 'bg-yellow-500/20 text-yellow-700',
    'Fabric Ordered': 'bg-blue-500/20 text-blue-700',
    'Draft': 'bg-gray-500/20 text-gray-700',
    'Cancelled': 'bg-red-500/20 text-red-700',
};

export default function PurchasesPage() {

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const filteredPurchaseOrders = useMemo(() => {
        return purchaseOrders.filter((po) => {
            const poDate = new Date(po.date);
            if (dateRange?.from && dateRange?.to) {
                return isWithinInterval(poDate, { start: dateRange.from, end: dateRange.to });
            }
            return true;
        });
    }, [dateRange]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Purchases</h1>
            <p className="text-muted-foreground">Manage purchase orders and supplier payments.</p>
        </div>
        <div className="flex items-center gap-2">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button size="sm" asChild>
            <Link href="/dashboard/purchases/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Purchase Order
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
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
                {filteredPurchaseOrders.map((po) => (
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
                    <TableCell className="text-right">${po.total.toFixed(2)}</TableCell>
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
            {filteredPurchaseOrders.map((po) => (
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
                                <p className="font-semibold font-mono">${po.total.toFixed(2)}</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    