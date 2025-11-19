

'use client';

import * as React from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  FileWarning,
  Undo2,
  Trash2,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getIncompleteOrders } from '@/services/orders';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ITEMS_PER_PAGE = 10;

export default function IncompleteOrdersPage() {
  const [allOrders, setAllOrders] = React.useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    getIncompleteOrders().then((data) => {
      setAllOrders(data);
      setIsLoading(false);
    });
  }, []);

  const filteredOrders = React.useMemo(() => {
    if (!searchTerm) return allOrders;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(lowercasedSearchTerm) ||
        order.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
        order.customerPhone.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, allOrders]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCancel = (orderId: string) => {
    setAllOrders(prev => prev.filter(o => o.id !== orderId));
  }

  const renderTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
                <p className="font-bold">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
            </TableCell>
            <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
            <TableCell className="text-right font-mono">
              ৳{order.total.toFixed(2)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <AlertDialog>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Convert
                    </Link>
                  </Button>
                   <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the incomplete order for <strong>{order.customerName}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancel(order.id)}>Confirm Cancel</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCards = () => (
      <div className="space-y-4">
          {paginatedOrders.map((order) => (
              <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                      <div>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <p className="text-muted-foreground">{format(new Date(order.date), 'MMM d, yyyy')}</p>
                          <p className="font-semibold font-mono text-lg">৳{order.total.toFixed(2)}</p>
                      </div>
                      <Separator />
                        <div className="flex justify-end gap-2">
                            <AlertDialog>
                                <Button variant="outline" size="sm" asChild className="flex-1">
                                    <Link href={`/dashboard/orders/${order.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Convert
                                    </Link>
                                </Button>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="flex-1">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will cancel the incomplete order for <strong>{order.customerName}</strong>. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancel(order.id)}>Confirm Cancel</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                  </CardContent>
              </Card>
          ))}
      </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold">Incomplete Orders</h1>
          <p className="text-muted-foreground hidden sm:block">
            Manage abandoned carts and convert them to real orders.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Abandoned Cart List</CardTitle>
            <CardDescription>
                These are potential orders from customers who started the checkout process but did not complete it.
            </CardDescription>
            <div className="pt-4">
                <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : paginatedOrders.length > 0 ? (
            <>
                <div className="hidden sm:block">{renderTable()}</div>
                <div className="sm:hidden">{renderCards()}</div>
            </>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground">
              <FileWarning className="w-12 h-12 mb-4" />
              <h3 className="font-semibold">No Incomplete Orders Found</h3>
              <p className="text-sm">When a customer abandons a checkout, it will appear here.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Showing{' '}
              <strong>
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}
              </strong>{' '}
              of <strong>{filteredOrders.length}</strong> orders
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
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

