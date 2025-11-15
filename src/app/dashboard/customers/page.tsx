
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
  CardFooter,
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCustomers } from '@/services/customers';
import type { Customer } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = React.useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  React.useEffect(() => {
    getCustomers().then(data => {
        setAllCustomers(data);
        setIsLoading(false);
    });
  }, []);

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    // This would typically trigger an AlertDialog, handled below
  };

  const filteredCustomers = React.useMemo(() => {
    if (!searchTerm) return allCustomers;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedSearchTerm) ||
      customer.phone.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, allCustomers]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
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
        {paginatedCustomers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{customer.phone}</TableCell>
            <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell>
            <TableCell className="hidden md:table-cell text-right font-mono">
              ৳{customer.totalSpent.toFixed(2)}
            </TableCell>
            <TableCell>
               <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/customers/${customer.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(customer)}>Edit</DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the customer profile for <strong>{customer.name}</strong> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCardList = () => (
    <div className="space-y-4">
      {paginatedCustomers.map(customer => (
        <Card key={customer.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
               <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/customers/${customer.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(customer)}>Edit</DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete the customer profile for <strong>{customer.name}</strong> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Customer</span>
                        <span className="sm:hidden sr-only">Add Customer</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                        <DialogDescription>
                        Fill in the details to create a new customer profile.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                        <Label htmlFor="add-name">Name</Label>
                        <Input id="add-name" placeholder="Enter customer's name" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="add-phone">Phone</Label>
                        <Input id="add-phone" placeholder="Enter phone number" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="add-address">Address</Label>
                        <Textarea id="add-address" placeholder="Enter full address" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsAddDialogOpen(false)}>Save Customer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Loading customers...
            </div>
          ) : (
            <>
              <div className="hidden sm:block">{renderTable()}</div>
              <div className="sm:hidden">{renderCardList()}</div>
            </>
          )}
        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)}
                    </strong> of <strong>{filteredCustomers.length}</strong> customers
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
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the details for {selectedCustomer?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" defaultValue={selectedCustomer?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" defaultValue={selectedCustomer?.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea id="edit-address" defaultValue={selectedCustomer?.address} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    