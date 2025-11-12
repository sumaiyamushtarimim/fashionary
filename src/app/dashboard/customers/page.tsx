
'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { customers, Customer } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCustomers = React.useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedSearchTerm) ||
      customer.phone.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  const renderTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead className="hidden sm:table-cell">Phone</TableHead>
          <TableHead className="hidden md:table-cell">Total Orders</TableHead>
          <TableHead className="hidden md:table-cell text-right">Total Spent</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCustomers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{customer.phone}</TableCell>
            <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell>
            <TableCell className="hidden md:table-cell text-right font-mono">
              ৳{customer.totalSpent.toFixed(2)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCardList = () => (
    <div className="space-y-4">
      {filteredCustomers.map(customer => (
        <Card key={customer.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
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
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-sm">
                <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-medium">{customer.totalOrders}</p>
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground">Total Spent</p>
                    <p className="font-semibold font-mono">৳{customer.totalSpent.toFixed(2)}</p>
                </div>
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
          <h1 className="font-headline text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground hidden sm:block">
            Manage your customers and view their details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>A list of all your customers.</CardDescription>
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
          {isClient ? (
            <>
              <div className="hidden sm:block">{renderTable()}</div>
              <div className="sm:hidden">{renderCardList()}</div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Loading customers...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
